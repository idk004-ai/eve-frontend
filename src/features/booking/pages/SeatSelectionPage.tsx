import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { EmptyState } from "@/shared/components/EmptyState";
import { SeatMap } from "../components/SeatMap";
import { useBookingStore } from "../store";
import { buildSeatMapData } from "../utils";

export function SeatSelectionPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const selectedSeats = useBookingStore((s) => s.selectedSeats);
  const seatLimitError = useBookingStore((s) => s.seatLimitError);
  const setTrip = useBookingStore((s) => s.setTrip);
  const toggleSeat = useBookingStore((s) => s.toggleSeat);

  useEffect(() => {
    if (tripId) setTrip(tripId);
  }, [tripId, setTrip]);

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
