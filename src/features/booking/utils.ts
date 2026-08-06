import type { SeatAvailabilityStatus, Trip } from "@/shared/api/types";
import { busSeatsByBusId } from "@/shared/mocks/fleet";
import { mockLocations } from "@/shared/mocks/locations";
import { mockRoutes, mockRouteVariants, mockStops } from "@/shared/mocks/routes";
import {
  segmentSeatAvailabilitiesByTripId,
  tripInventoryByTripId,
  tripSeatsByTripId,
} from "@/shared/mocks/seat-inventory";
import { TRIP_HCM_DL_MORNING, TRIP_HN_DN_MORNING, TRIP_HN_DN_NIGHT } from "@/shared/mocks/trips";

export interface SeatMapSeatVM {
  seatId: string;
  seatNumber: string;
  floor: number;
  row: number;
  status: SeatAvailabilityStatus;
  seatType?: string | null;
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
        seatType: busSeat?.seatType,
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

/** Số giây còn lại tới `expiresAt` (ISO) — luôn tính lại từ mốc thời gian thật, không đếm dồn để tránh trôi. */
export function secondsUntil(expiresAt: string): number {
  return Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
}

export function formatCountdown(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export interface StopOptionVM {
  stopId: string;
  name: string;
  address: string;
  /** Giờ dự kiến đón/trả tại điểm dừng này, tính từ `departureTime` của trip + offset (HH:mm). */
  time: string;
}

function formatOffsetTime(baseIso: string, offsetMin: number): string {
  const date = new Date(new Date(baseIso).getTime() + offsetMin * 60_000);
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

/**
 * Điểm đón (PICKUP/BOTH) và điểm trả (DROPOFF/BOTH) của trip, ghép `stopTimes` với `mockStops`
 * để lấy tên/địa chỉ, sắp theo `stopSequence`.
 */
export function getStopOptions(trip: Trip): {
  pickups: StopOptionVM[];
  dropoffs: StopOptionVM[];
} {
  const pickups: StopOptionVM[] = [];
  const dropoffs: StopOptionVM[] = [];

  const sortedStopTimes = [...trip.stopTimes].sort((a, b) => a.stopSequence - b.stopSequence);
  for (const stopTime of sortedStopTimes) {
    const stop = mockStops.find((s) => s.id === stopTime.stopId);
    if (!stop) continue;

    if (stopTime.stopRole === "PICKUP" || stopTime.stopRole === "BOTH") {
      const offset = stopTime.departureOffsetMin ?? stopTime.arrivalOffsetMin ?? 0;
      pickups.push({
        stopId: stop.id,
        name: stop.name,
        address: stop.address,
        time: formatOffsetTime(trip.departureTime, offset),
      });
    }
    if (stopTime.stopRole === "DROPOFF" || stopTime.stopRole === "BOTH") {
      const offset = stopTime.arrivalOffsetMin ?? stopTime.departureOffsetMin ?? 0;
      dropoffs.push({
        stopId: stop.id,
        name: stop.name,
        address: stop.address,
        time: formatOffsetTime(trip.departureTime, offset),
      });
    }
  }

  return { pickups, dropoffs };
}

export function formatCurrencyVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

// Chưa có field giá trên Trip/TripSeat ở backend (xem ghi chú shared/api/types.ts) — mock giá
// mỗi ghế theo trip, khớp SEAT_PRICE_HN_DN đã dùng ở shared/mocks/bookings.ts.
const SEAT_PRICE_BY_TRIP_ID: Record<string, number> = {
  [TRIP_HN_DN_MORNING.id]: 450_000,
  [TRIP_HN_DN_NIGHT.id]: 480_000,
  [TRIP_HCM_DL_MORNING.id]: 320_000,
};
const DEFAULT_SEAT_PRICE = 400_000;

export function getSeatPrice(tripId: string): number {
  return SEAT_PRICE_BY_TRIP_ID[tripId] ?? DEFAULT_SEAT_PRICE;
}

/** Tên điểm đi/điểm đến của trip, ghép routeVariantId → Route → Location. */
export function getTripRouteLabel(trip: Trip): { fromName: string; toName: string } {
  const variant = mockRouteVariants.find((v) => v.id === trip.routeVariantId);
  const route = variant ? mockRoutes.find((r) => r.id === variant.routeId) : undefined;
  const from = route ? mockLocations.find((l) => l.id === route.departureLocationId) : undefined;
  const to = route ? mockLocations.find((l) => l.id === route.arrivalLocationId) : undefined;
  return { fromName: from?.name ?? "?", toName: to?.name ?? "?" };
}
