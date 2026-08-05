import type { Payment, QRCode, Refund } from "@/shared/api/types";
import { BOOKING_CONFIRMED, BOOKING_PAYMENT_PENDING } from "./bookings";

// 1x1 SVG "QR giả" — placeholder để render <img> khi dev không cần gọi payment-service thật.
const PLACEHOLDER_QR_DATA_URL =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#fff"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-size="14">MOCK QR</text></svg>',
  );

export const PAYMENT_DEMO_SUCCEEDED: Payment = {
  id: "payment-demo-succeeded",
  bookingId: BOOKING_CONFIRMED.id,
  userId: BOOKING_CONFIRMED.customerId,
  amount: BOOKING_CONFIRMED.totalAmount,
  currency: "VND",
  status: "SUCCEEDED",
  description: "Thanh toán vé xe Hà Nội - Đà Nẵng",
  paidAt: "2026-08-05T10:32:00+07:00",
  expiresAt: null,
};

export const PAYMENT_DEMO_PROCESSING: Payment = {
  id: "payment-demo-processing",
  bookingId: BOOKING_PAYMENT_PENDING.id,
  userId: BOOKING_PAYMENT_PENDING.customerId,
  amount: BOOKING_PAYMENT_PENDING.totalAmount,
  currency: "VND",
  status: "PROCESSING",
  description: "Thanh toán vé xe Hà Nội - Đà Nẵng",
  paidAt: null,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
};

export const mockPayments: Payment[] = [PAYMENT_DEMO_SUCCEEDED, PAYMENT_DEMO_PROCESSING];

/** QR gắn với PAYMENT_DEMO_PROCESSING — dùng cho trang thanh toán + poll trạng thái (mock). */
export const QR_CODE_DEMO: QRCode = {
  code: "QR-DEMO-001",
  desc: "Quét mã để thanh toán qua MoMo",
  data: {
    qrCode:
      "00020101021238570010A00000072701270006970454011399999999990208QRIBFTTA5303704540410000",
    qrDataURL: PLACEHOLDER_QR_DATA_URL,
  },
  expiresIn: 15 * 60,
};

export const REFUND_DEMO: Refund = {
  id: "refund-demo-1",
  paymentId: PAYMENT_DEMO_SUCCEEDED.id,
  amount: 450_000,
  reason: "CANCELLED_BY_USER",
  status: "PENDING",
  gatewayRefundId: null,
  initiatedBy: "USER",
  note: "Khách huỷ 1 trong 2 ghế trước giờ khởi hành",
};

export const mockRefunds: Refund[] = [REFUND_DEMO];
