import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { SEAT_STATUS_LABEL, type SeatMapData, type SeatMapSeatVM } from "../utils";

interface SeatMapProps extends SeatMapData {
  selectedSeatIds: string[];
  onToggle: (seat: SeatMapSeatVM) => void;
  disabled?: boolean;
}

function isSelectable(seat: SeatMapSeatVM, selected: boolean): boolean {
  return selected || seat.status === "AVAILABLE";
}

export function SeatMap({ floors, seatsByFloor, selectedSeatIds, onToggle, disabled }: SeatMapProps) {
  const [activeFloor, setActiveFloor] = useState(floors[0] ?? 1);
  const seats = seatsByFloor[activeFloor] ?? [];

  return (
    <div>
      {floors.length > 1 && (
        <div
          role="tablist"
          aria-label="Chọn tầng"
          className="mb-4 inline-flex rounded-md border border-gray-200 bg-gray-50 p-1"
        >
          {floors.map((floor) => (
            <button
              key={floor}
              type="button"
              role="tab"
              aria-selected={floor === activeFloor}
              onClick={() => setActiveFloor(floor)}
              className={cn(
                "rounded px-4 py-1.5 text-sm font-medium transition-colors",
                floor === activeFloor
                  ? "bg-white text-brand-700 shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              Tầng {floor}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {seats.map((seat) => {
          const selected = selectedSeatIds.includes(seat.seatId);
          const selectable = isSelectable(seat, selected);
          return (
            <button
              key={seat.seatId}
              type="button"
              disabled={disabled || !selectable}
              onClick={() => onToggle(seat)}
              title={`${seat.seatNumber} — ${SEAT_STATUS_LABEL[seat.status]}`}
              aria-pressed={selected}
              className={cn(
                "flex h-11 items-center justify-center rounded-md border text-xs font-semibold transition-colors",
                selected && "border-brand-600 bg-brand-600 text-white",
                !selected &&
                  seat.status === "AVAILABLE" &&
                  "border-gray-300 bg-white text-gray-700 hover:border-brand-400 hover:bg-brand-50",
                !selected &&
                  seat.status === "BOOKED" &&
                  "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-400",
                !selected &&
                  (seat.status === "RESERVED" || seat.status === "LOCKED") &&
                  "cursor-not-allowed border-amber-200 bg-amber-100 text-amber-700",
                !selected &&
                  seat.status === "CANCELLED" &&
                  "cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300",
              )}
            >
              {seat.seatNumber}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-600">
        <SeatMapLegendItem swatchClassName="border-gray-300 bg-white" label="Còn trống" />
        <SeatMapLegendItem swatchClassName="border-brand-600 bg-brand-600" label="Đang chọn" />
        <SeatMapLegendItem swatchClassName="border-amber-200 bg-amber-100" label="Đang được giữ" />
        <SeatMapLegendItem swatchClassName="border-gray-200 bg-gray-200" label="Đã bán" />
      </div>
    </div>
  );
}

function SeatMapLegendItem({
  swatchClassName,
  label,
}: {
  swatchClassName: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("h-4 w-4 rounded border", swatchClassName)} />
      {label}
    </span>
  );
}
