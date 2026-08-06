import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CreateBookingItemRequest, CreateBookingRequest } from "@/shared/api/types";
import { EmptyState } from "@/shared/components/EmptyState";
import { Spinner } from "@/shared/ui/spinner";
import { mockTrips } from "@/shared/mocks/trips";
import { BookingSummarySidebar } from "../components/BookingSummarySidebar";
import { HoldCountdown } from "../components/HoldCountdown";
import { PassengerForm } from "../components/PassengerForm";
import { SeatMap } from "../components/SeatMap";
import { StopSelector } from "../components/StopSelector";
import { useCreateBookingMutation, useSeatHoldMutation } from "../hooks";
import { useBookingStore } from "../store";
import { buildSeatMapData, getSeatPrice, getStopOptions, getTripRouteLabel } from "../utils";

const HOLD_DEBOUNCE_MS = 500;

export function SeatSelectionPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const seatLimitError = useBookingStore((s) => s.seatLimitError);
  const hold = useBookingStore((s) => s.hold);
  const holdMessage = useBookingStore((s) => s.holdMessage);
  const setTrip = useBookingStore((s) => s.setTrip);
  const toggleSeat = useBookingStore((s) => s.toggleSeat);
  const setHold = useBookingStore((s) => s.setHold);
  const clearHold = useBookingStore((s) => s.clearHold);
  const releaseHold = useBookingStore((s) => s.releaseHold);
  const pickupStopId = useBookingStore((s) => s.pickupStopId);
  const dropoffStopId = useBookingStore((s) => s.dropoffStopId);
  const setPickupStop = useBookingStore((s) => s.setPickupStop);
  const setDropoffStop = useBookingStore((s) => s.setDropoffStop);
  const contact = useBookingStore((s) => s.contact);
  const setContact = useBookingStore((s) => s.setContact);
  const holdMutation = useSeatHoldMutation();
  const createBookingMutation = useCreateBookingMutation();

  const trip = tripId ? mockTrips.find((t) => t.id === tripId) : undefined;

  useEffect(() => {
    if (tripId) setTrip(tripId);
  }, [tripId, setTrip]);

  // Mặc định điểm đón = điểm đón đầu tiên, điểm trả = điểm trả cuối cùng (trọn tuyến) — chạy lại
  // mỗi khi đổi trip nên luôn ghi đè đúng theo trip mới, không phụ thuộc giá trị cũ trong store.
  useEffect(() => {
    if (!trip) return;
    const { pickups, dropoffs } = getStopOptions(trip);
    if (pickups[0]) setPickupStop(pickups[0].stopId);
    if (dropoffs.length > 0) setDropoffStop(dropoffs[dropoffs.length - 1].stopId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip?.id]);

  const seatIdsKey = useMemo(
    () =>
      selectedSeats
        .map((s) => s.seatId)
        .sort()
        .join(","),
    [selectedSeats],
  );

  // Mỗi khi tập ghế đã chọn đổi: debounce rồi tạo hold mới bao phủ đúng tập ghế hiện tại
  // (giữ ghế khi chọn — Phase 2). Không phụ thuộc `holdMutation.mutate` vì tham chiếu đổi mỗi
  // render, đưa vào deps sẽ phá debounce.
  useEffect(() => {
    if (!tripId) return;
    if (!seatIdsKey) {
      clearHold();
      return;
    }
    const timer = setTimeout(() => {
      holdMutation.mutate(
        { tripId, seatIds: seatIdsKey.split(",") },
        {
          onSuccess: (nextHold) => setHold(nextHold),
          onError: (error) => releaseHold(error.message),
        },
      );
    }, HOLD_DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, seatIdsKey]);

  const seatMapData = tripId ? buildSeatMapData(tripId) : null;
  const stopOptions = trip ? getStopOptions(trip) : null;

  if (!seatMapData || !trip || !stopOptions) {
    return (
      <EmptyState
        title="Không tìm thấy chuyến"
        description="Chuyến xe này không tồn tại hoặc đã ngừng bán vé."
      />
    );
  }

  const { fromName, toName } = getTripRouteLabel(trip);
  const pickup = stopOptions.pickups.find((p) => p.stopId === pickupStopId) ?? null;
  const dropoff = stopOptions.dropoffs.find((d) => d.stopId === dropoffStopId) ?? null;
  const seatPrice = getSeatPrice(trip.id);
  const totalAmount = selectedSeats.length * seatPrice;

  const blockedReason =
    selectedSeats.length === 0
      ? "Chọn ít nhất 1 ghế để tiếp tục"
      : !hold
        ? "Đang giữ ghế, vui lòng đợi trong giây lát"
        : !pickup || !dropoff
          ? "Chọn điểm đón và điểm trả"
          : !contact
            ? "Điền đầy đủ thông tin hành khách hợp lệ"
            : null;

  function handleCheckout() {
    if (!trip || !hold || !pickup || !dropoff || !contact) return;

    const bookingItems: CreateBookingItemRequest[] = selectedSeats.map((seat) => ({
      passengerName: contact.fullName,
      passengerPhone: contact.phone,
      seatNumber: seat.seatNumber,
      stopOrderFrom: trip.stopTimes.find((st) => st.stopId === pickup.stopId)?.stopSequence ?? 1,
      stopOrderTo: trip.stopTimes.find((st) => st.stopId === dropoff.stopId)?.stopSequence ?? 1,
      price: seatPrice,
      departureTime: trip.departureTime,
      arrivalTime: trip.arrivalTime,
      fromStopName: pickup.name,
      toStopName: dropoff.name,
      seatType: seat.seatType ?? undefined,
      floor: seat.floor,
    }));

    const request: CreateBookingRequest = {
      customerId: hold.customerId,
      tripId: trip.id,
      bookingItems,
      gateway: "VNPAY",
      currency: "VND",
      desc: `Vé xe ${fromName} - ${toName}`,
    };

    createBookingMutation.mutate(request, {
      onSuccess: (booking) => navigate(`/bookings/${booking.id}/payment`),
    });
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-gray-900">Chọn ghế</h1>
        <p className="mt-1 text-sm text-gray-500">
          Đã chọn {selectedSeats.length} ghế
          {selectedSeats.length > 0 && `: ${selectedSeats.map((s) => s.seatNumber).join(", ")}`}
        </p>
        {seatLimitError && <p className="mt-2 text-sm text-red-600">{seatLimitError}</p>}
        {holdMessage && <p className="mt-2 text-sm text-red-600">{holdMessage}</p>}
        {holdMutation.isPending && (
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <Spinner /> Đang giữ ghế...
          </p>
        )}
        {hold && (
          <div className="mt-2">
            <HoldCountdown
              key={hold.id}
              expiresAt={hold.expiresAt}
              onExpire={() => releaseHold("Hết thời gian giữ ghế, vui lòng chọn lại ghế")}
            />
          </div>
        )}
        <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
          <SeatMap
            {...seatMapData}
            selectedSeatIds={selectedSeats.map((s) => s.seatId)}
            onToggle={toggleSeat}
          />
        </div>

        {stopOptions && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <StopSelector
              name="pickup-stop"
              title="Điểm đón"
              options={stopOptions.pickups}
              selectedStopId={pickupStopId}
              onChange={setPickupStop}
            />
            <StopSelector
              name="dropoff-stop"
              title="Điểm trả"
              options={stopOptions.dropoffs}
              selectedStopId={dropoffStopId}
              onChange={setDropoffStop}
            />
          </div>
        )}

        <div className="mt-6">
          <PassengerForm defaultValues={contact ?? undefined} onChangeValid={setContact} />
        </div>
      </div>

      <BookingSummarySidebar
        fromName={fromName}
        toName={toName}
        departureTime={trip.departureTime}
        selectedSeats={selectedSeats}
        pickup={pickup}
        dropoff={dropoff}
        totalAmount={totalAmount}
        blockedReason={blockedReason}
        isSubmitting={createBookingMutation.isPending}
        submitError={createBookingMutation.error?.message ?? null}
        onSubmit={handleCheckout}
      />
    </div>
  );
}
