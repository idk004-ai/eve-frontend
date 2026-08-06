import type { SeatAvailabilityStatus } from "@/shared/api/types";
import { busSeatsByBusId } from "@/shared/mocks/fleet";
import {
  segmentSeatAvailabilitiesByTripId,
  tripInventoryByTripId,
  tripSeatsByTripId,
} from "@/shared/mocks/seat-inventory";

export interface SeatMapSeatVM {
  seatId: string;
  seatNumber: string;
  floor: number;
  row: number;
  status: SeatAvailabilityStatus;
}

export interface SeatMapData {
  floors: number[];
  seatsByFloor: Record<number, SeatMapSeatVM[]>;
}

export const SEAT_STATUS_LABEL: Record<SeatAvailabilityStatus, string> = {
  AVAILABLE: "Còn trống",
  BOOKED: "Đã bán",
  RESERVED: "Đang được giữ",
  LOCKED: "Đang được giữ",
  CANCELLED: "Ngừng bán",
};

// Ưu tiên hiển thị trạng thái "xấu nhất" khi 1 ghế xuất hiện ở nhiều segment cùng trip
// (BOOKED/LOCKED/RESERVED che AVAILABLE) — khớp ngữ nghĩa segment-based inventory ở backend.
const STATUS_PRIORITY: SeatAvailabilityStatus[] = [
  "BOOKED",
  "LOCKED",
  "RESERVED",
  "CANCELLED",
  "AVAILABLE",
];

function worstStatus(statuses: SeatAvailabilityStatus[]): SeatAvailabilityStatus {
  for (const candidate of STATUS_PRIORITY) {
    if (statuses.includes(candidate)) return candidate;
  }
  return "AVAILABLE";
}

/**
 * Ghép TripSeat (seat-inventory) với BusSeat (fleet) theo seatNumber để lấy tầng — TripSeat
 * không lưu floor (xem ghi chú trong shared/api/types.ts), đây là cách duy nhất backend hỗ trợ
 * để vẽ sơ đồ theo tầng.
 */
export function buildSeatMapData(tripId: string): SeatMapData | null {
  const inventory = tripInventoryByTripId[tripId];
  const tripSeats = tripSeatsByTripId[tripId];
  if (!inventory || !tripSeats) return null;

  const busSeats = busSeatsByBusId[inventory.busId] ?? [];
  const availabilities = segmentSeatAvailabilitiesByTripId[tripId] ?? [];

  const statusesBySeatId = new Map<string, SeatAvailabilityStatus[]>();
  for (const availability of availabilities) {
    const list = statusesBySeatId.get(availability.seatId) ?? [];
    list.push(availability.status);
    statusesBySeatId.set(availability.seatId, list);
  }

  const seats: SeatMapSeatVM[] = tripSeats
    .filter((seat) => seat.isActive)
    .map((seat) => {
      const busSeat = busSeats.find((b) => b.seatNumber === seat.seatNumber);
      const rowMatch = /\d+/.exec(seat.seatNumber);
      return {
        seatId: seat.id,
        seatNumber: seat.seatNumber,
        floor: busSeat?.floor ?? 1,
        row: rowMatch ? Number(rowMatch[0]) : 0,
        status: worstStatus(statusesBySeatId.get(seat.id) ?? ["AVAILABLE"]),
      };
    })
    .sort((a, b) => a.row - b.row);

  const floors = [...new Set(seats.map((s) => s.floor))].sort((a, b) => a - b);
  const seatsByFloor: Record<number, SeatMapSeatVM[]> = {};
  for (const floor of floors) {
    seatsByFloor[floor] = seats.filter((s) => s.floor === floor);
  }

  return { floors, seatsByFloor };
}
