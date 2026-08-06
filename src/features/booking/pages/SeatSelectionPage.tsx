import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { EmptyState } from "@/shared/components/EmptyState";
import { Spinner } from "@/shared/ui/spinner";
import { HoldCountdown } from "../components/HoldCountdown";
import { SeatMap } from "../components/SeatMap";
import { useSeatHoldMutation } from "../hooks";
import { useBookingStore } from "../store";
import { buildSeatMapData } from "../utils";

const HOLD_DEBOUNCE_MS = 500;

export function SeatSelectionPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const seatLimitError = useBookingStore((s) => s.seatLimitError);
  const hold = useBookingStore((s) => s.hold);
  const holdMessage = useBookingStore((s) => s.holdMessage);
  const setTrip = useBookingStore((s) => s.setTrip);
  const toggleSeat = useBookingStore((s) => s.toggleSeat);
  const setHold = useBookingStore((s) => s.setHold);
  const clearHold = useBookingStore((s) => s.clearHold);
  const releaseHold = useBookingStore((s) => s.releaseHold);
  const holdMutation = useSeatHoldMutation();

  useEffect(() => {
    if (tripId) setTrip(tripId);
  }, [tripId, setTrip]);

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

  if (!seatMapData) {
    return (
      <EmptyState
        title="Không tìm thấy chuyến"
        description="Chuyến xe này không tồn tại hoặc đã ngừng bán vé."
      />
    );
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
      </div>
    </div>
  );
}
