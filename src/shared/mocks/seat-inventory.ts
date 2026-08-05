import type {
  SeatHold,
  SegmentSeatAvailability,
  TripInventory,
  TripSeat,
  TripSegment,
} from "@/shared/api/types";
import { busSeatsByBusId, BUS_51B_12345, BUS_51B_67890 } from "./fleet";
import {
  STOP_DL_HOA_BINH,
  STOP_DL_TRUNG_TAM,
  STOP_DN_HAI_CHAU,
  STOP_DN_TRUNG_TAM,
  STOP_HCM_AN_SUONG,
  STOP_HCM_MIEN_DONG,
  STOP_HN_GIAP_BAT,
  STOP_HN_MY_DINH,
} from "./routes";
import { TRIP_HCM_DL_MORNING, TRIP_HN_DN_MORNING, TRIP_HN_DN_NIGHT } from "./trips";

function buildTripSeats(tripId: string, busId: string): TripSeat[] {
  const busSeats = busSeatsByBusId[busId] ?? [];
  return busSeats.map((seat) => ({
    id: `${tripId}__${seat.seatNumber}`,
    tripId,
    seatNumber: seat.seatNumber,
    isActive: seat.isActive,
  }));
}

/** 3 chặng nối tiếp giữa 4 điểm dừng (đón1 → đón2 → trả1 → trả2), khớp stopSequence trong trips.ts. */
function buildTripSegments(
  tripId: string,
  stopIds: [string, string, string, string],
): TripSegment[] {
  const [s1, s2, s3, s4] = stopIds;
  return [
    {
      id: `${tripId}__seg1`,
      tripId,
      segmentIndex: 1,
      fromStopId: s1,
      toStopId: s2,
      fromSeq: 1,
      toSeq: 2,
    },
    {
      id: `${tripId}__seg2`,
      tripId,
      segmentIndex: 2,
      fromStopId: s2,
      toStopId: s3,
      fromSeq: 2,
      toSeq: 3,
    },
    {
      id: `${tripId}__seg3`,
      tripId,
      segmentIndex: 3,
      fromStopId: s3,
      toStopId: s4,
      fromSeq: 3,
      toSeq: 4,
    },
  ];
}

const HN_DN_STOP_IDS: [string, string, string, string] = [
  STOP_HN_MY_DINH.id,
  STOP_HN_GIAP_BAT.id,
  STOP_DN_TRUNG_TAM.id,
  STOP_DN_HAI_CHAU.id,
];

const HCM_DL_STOP_IDS: [string, string, string, string] = [
  STOP_HCM_MIEN_DONG.id,
  STOP_HCM_AN_SUONG.id,
  STOP_DL_TRUNG_TAM.id,
  STOP_DL_HOA_BINH.id,
];

function buildSegmentSeatAvailabilities(
  segments: TripSegment[],
  seats: TripSeat[],
  bookedSeatNumbers: string[],
  heldSeatNumbers: string[],
  holdId: string,
): SegmentSeatAvailability[] {
  const result: SegmentSeatAvailability[] = [];
  for (const segment of segments) {
    for (const seat of seats) {
      const isBooked = bookedSeatNumbers.includes(seat.seatNumber);
      const isHeld = heldSeatNumbers.includes(seat.seatNumber);
      result.push({
        id: `${segment.id}__${seat.seatNumber}`,
        tripSegmentId: segment.id,
        seatId: seat.id,
        status: isBooked ? "BOOKED" : isHeld ? "RESERVED" : "AVAILABLE",
        holdId: isHeld ? holdId : null,
        allocationId: isBooked ? `alloc-${seat.id}` : null,
      });
    }
  }
  return result;
}

export const SEAT_HOLD_DEMO_ID = "seat-hold-demo-1";

/** Ghế A3 của TRIP_HN_DN_MORNING đang được giữ để demo trạng thái "Đang chọn/đã giữ" + đếm ngược. */
export const SEAT_HOLD_DEMO: SeatHold = {
  id: SEAT_HOLD_DEMO_ID,
  tripId: TRIP_HN_DN_MORNING.id,
  customerId: "cust-demo-1",
  expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  status: "ACTIVE",
};

/** Tạo seat-hold mock mới với TTL tuỳ chỉnh — dùng để demo đồng hồ đếm ngược giữ ghế (Track D4). */
export function createMockSeatHold(
  overrides: Partial<SeatHold> & { ttlSeconds?: number } = {},
): SeatHold {
  const { ttlSeconds = 5 * 60, ...rest } = overrides;
  return {
    id: `seat-hold-${Date.now()}`,
    tripId: TRIP_HN_DN_MORNING.id,
    customerId: "cust-demo-1",
    expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
    status: "ACTIVE",
    ...rest,
  };
}

export const mockSeatHolds: SeatHold[] = [SEAT_HOLD_DEMO];

export const tripInventoryByTripId: Record<string, TripInventory> = {
  [TRIP_HN_DN_MORNING.id]: {
    id: TRIP_HN_DN_MORNING.id,
    busId: BUS_51B_12345.id,
    totalSeat: 34,
    availableSeat: 30,
    status: "OPEN",
  },
  [TRIP_HN_DN_NIGHT.id]: {
    id: TRIP_HN_DN_NIGHT.id,
    busId: BUS_51B_12345.id,
    totalSeat: 34,
    availableSeat: 34,
    status: "OPEN",
  },
  [TRIP_HCM_DL_MORNING.id]: {
    id: TRIP_HCM_DL_MORNING.id,
    busId: BUS_51B_67890.id,
    totalSeat: 22,
    availableSeat: 22,
    status: "OPEN",
  },
};

export const mockTripInventories: TripInventory[] = Object.values(tripInventoryByTripId);

export const tripSegmentsByTripId: Record<string, TripSegment[]> = {
  [TRIP_HN_DN_MORNING.id]: buildTripSegments(TRIP_HN_DN_MORNING.id, HN_DN_STOP_IDS),
  [TRIP_HN_DN_NIGHT.id]: buildTripSegments(TRIP_HN_DN_NIGHT.id, HN_DN_STOP_IDS),
  [TRIP_HCM_DL_MORNING.id]: buildTripSegments(TRIP_HCM_DL_MORNING.id, HCM_DL_STOP_IDS),
};

export const mockTripSegments: TripSegment[] = Object.values(tripSegmentsByTripId).flat();

export const tripSeatsByTripId: Record<string, TripSeat[]> = {
  [TRIP_HN_DN_MORNING.id]: buildTripSeats(TRIP_HN_DN_MORNING.id, BUS_51B_12345.id),
  [TRIP_HN_DN_NIGHT.id]: buildTripSeats(TRIP_HN_DN_NIGHT.id, BUS_51B_12345.id),
  [TRIP_HCM_DL_MORNING.id]: buildTripSeats(TRIP_HCM_DL_MORNING.id, BUS_51B_67890.id),
};

export const mockTripSeats: TripSeat[] = Object.values(tripSeatsByTripId).flat();

// Ghế A1, A2, B5 đã bán; A3 đang được giữ (khớp SEAT_HOLD_DEMO) — đủ để test legend Đã bán/Đang chọn/Còn trống.
export const segmentSeatAvailabilitiesByTripId: Record<string, SegmentSeatAvailability[]> = {
  [TRIP_HN_DN_MORNING.id]: buildSegmentSeatAvailabilities(
    tripSegmentsByTripId[TRIP_HN_DN_MORNING.id],
    tripSeatsByTripId[TRIP_HN_DN_MORNING.id],
    ["A1", "A2", "B5"],
    ["A3"],
    SEAT_HOLD_DEMO_ID,
  ),
  [TRIP_HN_DN_NIGHT.id]: buildSegmentSeatAvailabilities(
    tripSegmentsByTripId[TRIP_HN_DN_NIGHT.id],
    tripSeatsByTripId[TRIP_HN_DN_NIGHT.id],
    [],
    [],
    SEAT_HOLD_DEMO_ID,
  ),
  [TRIP_HCM_DL_MORNING.id]: buildSegmentSeatAvailabilities(
    tripSegmentsByTripId[TRIP_HCM_DL_MORNING.id],
    tripSeatsByTripId[TRIP_HCM_DL_MORNING.id],
    ["A1"],
    [],
    SEAT_HOLD_DEMO_ID,
  ),
};

export const mockSegmentSeatAvailabilities: SegmentSeatAvailability[] = Object.values(
  segmentSeatAvailabilitiesByTripId,
).flat();
