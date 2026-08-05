import type { Booking, BookingItem } from "@/shared/api/types";
import { STOP_DN_TRUNG_TAM, STOP_HN_GIAP_BAT } from "./routes";
import { tripSegmentsByTripId, tripSeatsByTripId } from "./seat-inventory";
import { TRIP_HN_DN_MORNING } from "./trips";

const SEAT_PRICE_HN_DN = 450_000;

function seatIdOf(seatNumber: string): string {
  const seat = tripSeatsByTripId[TRIP_HN_DN_MORNING.id].find((s) => s.seatNumber === seatNumber);
  if (!seat) throw new Error(`Không tìm thấy ghế mock ${seatNumber}`);
  return seat.id;
}

// seg2 = chặng chính Giáp Bát -> Trung tâm Đà Nẵng, khớp buildTripSegments trong seat-inventory.ts
const MAIN_LEG_SEGMENT_ID = tripSegmentsByTripId[TRIP_HN_DN_MORNING.id][1].id;

function bookingItem(
  overrides: Pick<BookingItem, "id" | "bookingId" | "seatNumber" | "status">,
): BookingItem {
  return {
    tripId: TRIP_HN_DN_MORNING.id,
    tripSegmentId: MAIN_LEG_SEGMENT_ID,
    seatId: seatIdOf(overrides.seatNumber),
    holdId: null,
    allocationId: `alloc-${overrides.seatNumber}`,
    passengerName: "Nguyễn Văn A",
    passengerPhone: "0912345678",
    price: SEAT_PRICE_HN_DN,
    stopOrderFrom: 2,
    stopOrderTo: 3,
    departureTime: TRIP_HN_DN_MORNING.departureTime,
    arrivalTime: TRIP_HN_DN_MORNING.arrivalTime,
    fromStopName: STOP_HN_GIAP_BAT.name,
    toStopName: STOP_DN_TRUNG_TAM.name,
    seatType: "Giường nằm",
    floor: overrides.seatNumber.startsWith("A") ? 1 : 2,
    ...overrides,
  };
}

export const BOOKING_CONFIRMED_ID = "booking-demo-confirmed";
export const BOOKING_PAYMENT_PENDING_ID = "booking-demo-payment-pending";

/** Đã thanh toán xong (khớp PAYMENT_DEMO_SUCCEEDED trong payments.ts). */
export const BOOKING_CONFIRMED: Booking = {
  id: BOOKING_CONFIRMED_ID,
  bookingCode: "BK-00000001",
  customerId: "cust-demo-1",
  customerEmail: "khachhang@example.com",
  customerUsername: "khachhang01",
  customerPhone: "0912345678",
  tripId: TRIP_HN_DN_MORNING.id,
  status: "CONFIRMED",
  totalAmount: SEAT_PRICE_HN_DN * 2,
  expiresAt: "2026-08-09T08:00:00+07:00",
  paymentId: "payment-demo-succeeded",
  holdId: null,
  qrUrl: null,
  cancelReason: null,
  gateway: "VNPAY",
  currency: "VND",
  desc: "Vé xe Hà Nội - Đà Nẵng",
  items: [
    bookingItem({
      id: `${BOOKING_CONFIRMED_ID}__item1`,
      bookingId: BOOKING_CONFIRMED_ID,
      seatNumber: "A1",
      status: "CONFIRMED",
    }),
    bookingItem({
      id: `${BOOKING_CONFIRMED_ID}__item2`,
      bookingId: BOOKING_CONFIRMED_ID,
      seatNumber: "A2",
      status: "CONFIRMED",
    }),
  ],
};

/** Đã tạo QR, đang chờ khách quét (khớp PAYMENT_DEMO_PROCESSING trong payments.ts). */
export const BOOKING_PAYMENT_PENDING: Booking = {
  id: BOOKING_PAYMENT_PENDING_ID,
  bookingCode: "BK-00000002",
  customerId: "cust-demo-2",
  customerEmail: "khachhang2@example.com",
  customerUsername: "khachhang02",
  customerPhone: "0987654321",
  tripId: TRIP_HN_DN_MORNING.id,
  status: "PAYMENT_PENDING",
  totalAmount: SEAT_PRICE_HN_DN,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  paymentId: "payment-demo-processing",
  holdId: "seat-hold-history-1",
  qrUrl: null, // xem QRCode.data.qrDataURL trong payments.ts
  cancelReason: null,
  gateway: "MOMO",
  currency: "VND",
  desc: "Vé xe Hà Nội - Đà Nẵng",
  items: [
    bookingItem({
      id: `${BOOKING_PAYMENT_PENDING_ID}__item1`,
      bookingId: BOOKING_PAYMENT_PENDING_ID,
      seatNumber: "B5",
      status: "PENDING",
    }),
  ],
};

export const mockBookings: Booking[] = [BOOKING_CONFIRMED, BOOKING_PAYMENT_PENDING];
