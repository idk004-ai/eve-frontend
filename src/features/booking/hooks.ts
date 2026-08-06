import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store";
import { requestSeatHold } from "./mock-api";

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
