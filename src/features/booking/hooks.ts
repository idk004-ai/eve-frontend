import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import {
  createBooking,
  createQrCode,
  findBookingByCode,
  getBookingById,
  getPaymentStatus,
  requestSeatHold,
} from "./mock-api";

let guestCustomerId: string | null = null;

/** Khách chưa đăng nhập vẫn giữ được ghế — sinh 1 id tạm ổn định trong phiên trình duyệt. */
function getGuestCustomerId(): string {
  guestCustomerId ??= `guest-${Math.random().toString(36).slice(2, 10)}`;
  return guestCustomerId;
}

export function useSeatHoldMutation() {
  const user = useAuthStore((s) => s.user);
  return useMutation({
    mutationFn: ({ tripId, seatIds }: { tripId: string; seatIds: string[] }) =>
      requestSeatHold(tripId, seatIds, user?.id ?? getGuestCustomerId()),
  });
}

export function useCreateBookingMutation() {
  return useMutation({ mutationFn: createBooking });
}

export function useBookingQuery(bookingId: string | undefined) {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => getBookingById(bookingId as string),
    enabled: !!bookingId,
  });
}

export function useCreateQrCodeMutation() {
  return useMutation({
    mutationFn: ({ paymentId, amount }: { paymentId: string; amount: number }) =>
      createQrCode(paymentId, amount),
  });
}

const PAYMENT_POLL_INTERVAL_MS = 2000;

export function usePaymentStatusQuery(paymentId: string | undefined) {
  return useQuery({
    queryKey: ["payment-status", paymentId],
    queryFn: () => getPaymentStatus(paymentId as string),
    enabled: !!paymentId,
    // Dừng poll ngay khi có kết quả cuối (thành công/thất bại/hết hạn) — chỉ PROCESSING/PENDING
    // mới cần hỏi lại backend.
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return status === "PROCESSING" || status === "PENDING" ? PAYMENT_POLL_INTERVAL_MS : false;
    },
  });
}

export function useBookingLookupMutation() {
  return useMutation({ mutationFn: findBookingByCode });
}
