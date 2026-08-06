import type { Booking, BookingItem, CreateBookingRequest, Payment, SeatHold } from "@/shared/api/types";
import { mockBookings } from "@/shared/mocks/bookings";
import { mockPayments } from "@/shared/mocks/payments";
import { createMockSeatHold } from "@/shared/mocks/seat-inventory";

/**
 * "API" giả lập cho luồng đặt vé — chạy trên mock vì backend seat-holds/bookings/payment chưa
 * chốt hợp đồng (xem D10). Ký hiệu hàm (input/output, Promise) khớp dạng REST thật để D10 chỉ
 * cần thay phần thân bằng gọi `api.post(...)`, không phải sửa nơi gọi (hooks.ts).
 */

const HOLD_TTL_SECONDS = 5 * 60;
const HOLD_NETWORK_DELAY_MS = 400;
// Chưa có backend thật để test tranh chấp ghế bằng dữ liệu cố định — giả lập ngẫu nhiên
// (~1/8 lần) để demo luồng xử lý lỗi hold thất bại (D4/Phase 2 exit criteria).
const HOLD_CONFLICT_PROBABILITY = 0.125;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function requestSeatHold(
  tripId: string,
  seatIds: string[],
  customerId: string,
): Promise<SeatHold> {
  await wait(HOLD_NETWORK_DELAY_MS);

  if (seatIds.length > 0 && Math.random() < HOLD_CONFLICT_PROBABILITY) {
    throw new Error("Một số ghế vừa được người khác giữ, vui lòng chọn lại");
  }

  return createMockSeatHold({ tripId, customerId, ttlSeconds: HOLD_TTL_SECONDS });
}

/**
 * "DB" trong bộ nhớ cho booking/payment tạo trong phiên hiện tại — seed sẵn 2 booking demo từ
 * T0.5 để trang tra cứu (D9) và điều hướng thẳng URL vẫn hoạt động. Mất khi reload trang, chấp
 * nhận được vì đây là mock thay cho booking-service thật (D10).
 */
const bookingsDb = new Map<string, Booking>(mockBookings.map((b) => [b.id, b]));
const paymentsDb = new Map<string, Payment>(mockPayments.map((p) => [p.id, p]));

const BOOKING_NETWORK_DELAY_MS = 500;
const PAYMENT_TTL_SECONDS = 15 * 60;
let bookingSequence = mockBookings.length + 1;

export async function createBooking(request: CreateBookingRequest): Promise<Booking> {
  await wait(BOOKING_NETWORK_DELAY_MS);

  const bookingId = `booking-mock-${Date.now()}`;
  const paymentId = `payment-mock-${Date.now()}`;
  const expiresAt = new Date(Date.now() + PAYMENT_TTL_SECONDS * 1000).toISOString();
  const totalAmount = request.bookingItems.reduce((sum, item) => sum + item.price, 0);

  const items: BookingItem[] = request.bookingItems.map((item, index) => ({
    id: `${bookingId}__item${index + 1}`,
    bookingId,
    tripId: request.tripId,
    tripSegmentId: "",
    seatId: "",
    holdId: null,
    allocationId: null,
    passengerName: item.passengerName,
    passengerPhone: item.passengerPhone ?? null,
    seatNumber: item.seatNumber,
    price: item.price,
    status: "PENDING",
    stopOrderFrom: item.stopOrderFrom,
    stopOrderTo: item.stopOrderTo,
    departureTime: item.departureTime,
    arrivalTime: item.arrivalTime,
    fromStopName: item.fromStopName,
    toStopName: item.toStopName,
    seatType: item.seatType ?? null,
    floor: item.floor ?? null,
  }));

  const booking: Booking = {
    id: bookingId,
    bookingCode: `BK-${String(bookingSequence++).padStart(8, "0")}`,
    customerId: request.customerId,
    customerEmail: null,
    customerUsername: null,
    customerPhone: null,
    tripId: request.tripId,
    status: "PAYMENT_PENDING",
    totalAmount,
    expiresAt,
    paymentId,
    holdId: null,
    qrUrl: null,
    cancelReason: null,
    gateway: request.gateway,
    currency: request.currency,
    desc: request.desc ?? null,
    items,
  };

  const payment: Payment = {
    id: paymentId,
    bookingId,
    userId: request.customerId,
    amount: totalAmount,
    currency: request.currency,
    status: "PROCESSING",
    description: request.desc ?? null,
    paidAt: null,
    expiresAt,
  };

  bookingsDb.set(bookingId, booking);
  paymentsDb.set(paymentId, payment);
  return booking;
}

export async function getBookingById(id: string): Promise<Booking | null> {
  await wait(200);
  return bookingsDb.get(id) ?? null;
}

export async function getPaymentById(id: string): Promise<Payment | null> {
  await wait(200);
  return paymentsDb.get(id) ?? null;
}
