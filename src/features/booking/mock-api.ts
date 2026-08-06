import type { SeatHold } from "@/shared/api/types";
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
