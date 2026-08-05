/**
 * Types khớp với DTO/domain thật của backend (đọc trực tiếp từ source các service dưới
 * `~/projects/*-service`). Đây là "hợp đồng" cho toàn bộ track B–E code trên mock trước khi
 * gắn API thật — sửa file này khi backend đổi contract, đừng tự chế field không có ở backend.
 *
 * Vài điểm lệch so với suy đoán thông thường, đã verify lại với source:
 * - `BaseResponse.metadata` là object PHẲNG (page/size/total), không có `pagination` lồng nhau
 *   và không có `totalElements`/`totalPages`.
 * - route-service không có TripStatus/ScheduleStatus enum: Trip chỉ có isActive/isDeleted,
 *   Schedule lặp lịch bằng 7 field boolean (mon..sun), không phải enum ngày trong tuần.
 * - Booking.status / BookingItem.status là string thường ở backend (không phải enum type),
 *   nhưng giá trị hợp lệ khớp với BookingStatus/BookingItemStatus union bên dưới.
 * - fleet-service chưa có schema cho seatLayout (JSON tự do) — dữ liệu ghế có cấu trúc duy nhất
 *   là BusSeat (seatNumber/seatType/floor), chưa có REST DTO riêng cho nó.
 */

// ============================================================
// common-core — BaseResponse<T>
// ============================================================

export interface ApiMetadata {
  code: number;
  requestId: string;
  page?: number | null;
  size?: number | null;
  total?: number | null;
}

export interface BaseResponse<T> {
  status: "success" | "failed";
  message: string | null;
  metadata: ApiMetadata;
  data: T | null;
}

// ============================================================
// location-service
// ============================================================

export interface Location {
  id: string;
  name: string;
  city: string;
  province: string;
  region: string;
}

export interface CreateLocationRequest {
  name: string;
  city: string;
  province: string;
  region: string;
}

// ============================================================
// route-service
// ============================================================

export type StopRole = "PICKUP" | "DROPOFF" | "BOTH" | "PASS";

export interface Route {
  id: string;
  departureLocationId: string;
  arrivalLocationId: string;
  duration: number; // phút
  distance: number; // km
  isActive: boolean;
}

export interface RouteVariant {
  id: string;
  routeId: string;
  name: string;
}

export interface Stop {
  id: string;
  locationId: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  isActive: boolean;
}

export interface SelectedStop {
  stopId: string;
  stopSequence: number;
  stopRole: StopRole;
  arrivalOffsetMin?: number | null;
  departureOffsetMin?: number | null;
}

export interface Schedule {
  id: string;
  busId: string;
  startDate: string; // ISO Instant
  endDate: string; // ISO Instant
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
}

export interface TripStopTime {
  id: string;
  tripId: string;
  stopId: string;
  stopSequence: number;
  arrivalOffsetMin?: number | null;
  departureOffsetMin?: number | null;
  stopRole: StopRole;
}

export interface Trip {
  id: string;
  busId: string;
  scheduleId: string;
  routeVariantId: string;
  departureTime: string; // ISO Instant
  arrivalTime: string; // ISO Instant
  isActive: boolean;
  stopTimes: TripStopTime[];
}

export interface CreateTripRequest {
  busId: string;
  scheduleId: string;
  routeVariantId: string;
  departureTime: string;
  arrivalTime: string;
  stopTimes: SelectedStop[];
}

// ============================================================
// seat-inventory
// ============================================================

export type TripInventoryStatus = "OPEN" | "CLOSED" | "CANCELLED";

export type SeatAvailabilityStatus = "AVAILABLE" | "RESERVED" | "BOOKED" | "LOCKED" | "CANCELLED";

export type SeatHoldStatus = "ACTIVE" | "EXPIRED" | "RELEASED" | "CONFIRMED";

export type SeatAllocationStatus = "ALLOCATED" | "CANCELED";

/** id trùng với route-service Trip.id (merge, không tự sinh id riêng). */
export interface TripInventory {
  id: string;
  busId: string;
  totalSeat: number;
  availableSeat: number;
  status: TripInventoryStatus;
}

/**
 * Không có field floor — backend không lưu vị trí tầng/hàng/cột trên TripSeat.
 * Muốn vẽ sơ đồ theo tầng phải join theo seatNumber với BusSeat của bus (xem fleet-service).
 */
export interface TripSeat {
  id: string;
  tripId: string; // = TripInventory.id
  seatNumber: string;
  isActive: boolean;
}

/** tripId ở đây thực chất là TripInventory.id, không phải route-service Trip.id (naming kế thừa từ backend). */
export interface TripSegment {
  id: string;
  tripId: string;
  segmentIndex: number;
  fromStopId: string;
  toStopId: string;
  fromSeq: number;
  toSeq: number;
}

export interface SegmentSeatAvailability {
  id: string;
  tripSegmentId: string;
  seatId: string;
  status: SeatAvailabilityStatus;
  holdId?: string | null;
  allocationId?: string | null;
}

export interface SegmentSeatRes {
  segmentId: string;
  seats: TripSeat[];
}

/** expiresAt dùng để đồng bộ đồng hồ đếm ngược giữ ghế ở FE với TTL thật của backend. */
export interface SeatHold {
  id: string;
  tripId: string;
  customerId: string;
  expiresAt: string; // ISO OffsetDateTime
  status: SeatHoldStatus;
}

// ============================================================
// booking-service
// ============================================================

export type BookingStatus =
  | "PENDING" // saga đang chạy
  | "PAYMENT_PENDING" // đã tạo QR, chờ thanh toán
  | "CONFIRMED" // thanh toán SUCCEEDED
  | "COMPLETED" // chuyến đã hoàn thành
  | "CANCELLED"
  | "EXPIRED"; // hết hạn giữ ghế mà chưa thanh toán

export type BookingItemStatus = "PENDING" | "CONFIRMED" | "CANCELLED";

export interface BookingItem {
  id: string;
  bookingId: string;
  tripId: string;
  tripSegmentId: string;
  seatId: string;
  holdId?: string | null;
  allocationId?: string | null;
  passengerName: string;
  passengerPhone?: string | null;
  seatNumber: string;
  price: number;
  status: BookingItemStatus;
  stopOrderFrom: number;
  stopOrderTo: number;
  // snapshot tại thời điểm đặt vé
  departureTime: string;
  arrivalTime: string;
  fromStopName: string;
  toStopName: string;
  seatType?: string | null;
  floor?: number | null;
}

/**
 * customerEmail/customerUsername/customerPhone không phải cột DB thật — backend enrich thêm
 * (khả năng từ user-service) trước khi trả response, nên luôn coi là optional/có thể null.
 */
export interface Booking {
  id: string;
  bookingCode: string;
  customerId: string;
  customerEmail?: string | null;
  customerUsername?: string | null;
  customerPhone?: string | null;
  tripId: string;
  status: BookingStatus;
  totalAmount: number;
  expiresAt: string; // ISO OffsetDateTime
  paymentId?: string | null;
  holdId?: string | null;
  qrUrl?: string | null;
  cancelReason?: string | null;
  gateway?: string | null;
  currency?: string | null;
  desc?: string | null;
  items: BookingItem[];
}

export interface CreateBookingItemRequest {
  passengerName: string;
  passengerPhone?: string;
  seatNumber: string;
  stopOrderFrom: number;
  stopOrderTo: number;
  price: number;
  departureTime: string;
  arrivalTime: string;
  fromStopName: string;
  toStopName: string;
  seatType?: string;
  floor?: number;
}

export interface CreateBookingRequest {
  customerId: string;
  tripId: string;
  bookingItems: CreateBookingItemRequest[];
  gateway: string;
  currency: string;
  desc?: string;
}

// ============================================================
// payment-service
// ============================================================

export type PaymentStatus =
  | "PENDING" // vừa tạo, chưa gọi gateway
  | "PROCESSING" // đã có QR, chờ người dùng quét
  | "SUCCEEDED" // thành công, có paidAt
  | "FAILED" // hết hạn/sai OTP, có thể thử lại
  | "CANCELLED" // huỷ do saga compensation hoặc người dùng huỷ
  | "REFUND_PENDING"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethodType = "VNPAY" | "MOMO" | "ZALOPAY" | "BANK_TRANSFER" | "CASH";

export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  description?: string | null;
  paidAt?: string | null; // ISO Instant
  expiresAt?: string | null; // ISO Instant
}

export interface QRCode {
  code: string;
  desc: string;
  data: {
    qrCode: string;
    qrDataURL: string;
  };
  expiresIn: number; // giây
}

export interface CreateQRRequest {
  paymentId: string;
  amount: number;
}

export type RefundStatus = "PENDING" | "PROCESSING" | "SUCCEEDED" | "FAILED";

export type RefundReason =
  "CANCELLED_BY_USER" | "CANCELLED_BY_OPERATOR" | "TRIP_CANCELLED" | "DUPLICATE_PAYMENT";

export type RefundInitiator = "USER" | "OPERATOR" | "SYSTEM";

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: RefundReason;
  status: RefundStatus;
  gatewayRefundId?: string | null;
  initiatedBy: RefundInitiator;
  note?: string | null;
}

// ============================================================
// bus-operator-service / fleet-service
// ============================================================

/** status không có enum ở backend — string tự do, mặc định "ACTIVE". */
export interface BusOperator {
  id: string;
  code: string;
  legalName: string;
  displayName: string;
  status: string;
  contactEmail: string;
  contactPhone: string;
  address?: string | null;
  taxId: string;
  logoUrl?: string | null;
}

export interface BusType {
  id: string;
  name: string;
  description?: string | null;
}

/** Chưa có REST DTO riêng ở backend (chỉ dùng nội bộ qua gRPC) — field "deleted" chứ không phải "isDeleted". */
export interface BusSeat {
  id: string;
  busId: string;
  seatNumber: string;
  seatType?: string | null;
  floor?: number | null;
  isActive: boolean;
}

/** seatLayout/amenities là JSON tự do, backend chưa định nghĩa schema. */
export interface Bus {
  id: string;
  busOperatorId: string;
  busTypeId: string;
  licensePlate: string;
  totalSeats: number;
  seatLayout: Record<string, unknown>;
  amenities: Record<string, unknown>;
  status: string;
}

export interface CreateBusRequest {
  busOperatorId: string;
  busTypeId: string;
  licensePlate: string;
  totalSeats: number;
  seatLayout: Record<string, unknown>;
  amenities: Record<string, unknown>;
  status?: string;
}

export interface CreateBusTypeRequest {
  name: string;
  description?: string;
}
