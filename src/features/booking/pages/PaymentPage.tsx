import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { QRCode } from "@/shared/api/types";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { Spinner } from "@/shared/ui/spinner";
import { HoldCountdown } from "../components/HoldCountdown";
import { useBookingQuery, useCreateQrCodeMutation, usePaymentStatusQuery } from "../hooks";
import { formatCurrencyVnd } from "../utils";

const PENDING_PAYMENT_STATUSES = new Set(["PENDING", "PROCESSING"]);

export function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookingQuery = useBookingQuery(id);
  const booking = bookingQuery.data;
  const paymentId = booking?.paymentId ?? undefined;
  const paymentQuery = usePaymentStatusQuery(paymentId);
  const payment = paymentQuery.data;
  const qrMutation = useCreateQrCodeMutation();
  const [qrCode, setQrCode] = useState<QRCode | null>(null);

  const paymentStatus = payment?.status;
  const totalAmount = booking?.totalAmount;

  // Tạo QR đúng 1 lần, chỉ sau khi biết chắc payment đang ở trạng thái chờ thanh toán (tránh tạo
  // QR thừa cho payment đã SUCCEEDED/FAILED sẵn, vd điều hướng thẳng URL tới đơn cũ).
  useEffect(() => {
    if (!paymentId || totalAmount === undefined || qrCode) return;
    if (!paymentStatus || !PENDING_PAYMENT_STATUSES.has(paymentStatus)) return;
    qrMutation.mutate({ paymentId, amount: totalAmount }, { onSuccess: setQrCode });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, paymentStatus, totalAmount, qrCode]);

  // Thanh toán thành công → chuyển sang trang xác nhận (D9), không cho quay lại trang này bằng nút back.
  useEffect(() => {
    if (paymentStatus === "SUCCEEDED" && id) {
      navigate(`/bookings/${id}`, { replace: true });
    }
  }, [paymentStatus, id, navigate]);

  if (bookingQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-64 w-64" />
      </div>
    );
  }

  if (!booking) {
    return (
      <EmptyState
        title="Không tìm thấy đơn đặt vé"
        description="Đơn đặt vé này không tồn tại hoặc đã bị huỷ."
      />
    );
  }

  const isTimedOut =
    paymentStatus === "FAILED" ||
    paymentStatus === "CANCELLED" ||
    booking.status === "EXPIRED" ||
    booking.status === "CANCELLED";

  if (isTimedOut) {
    return (
      <EmptyState
        title="Hết thời gian thanh toán"
        description="Đơn đặt vé đã bị huỷ do quá thời gian thanh toán. Vui lòng chọn ghế lại."
        action={
          <Button onClick={() => navigate(`/trips/${booking.tripId}/seats`)}>
            Quay lại chọn ghế
          </Button>
        }
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
      <h1 className="text-xl font-semibold text-gray-900">Thanh toán</h1>
      <p className="text-sm text-gray-500">Mã đơn: {booking.bookingCode}</p>
      <p className="text-lg font-semibold text-brand-700">
        {formatCurrencyVnd(booking.totalAmount)}
      </p>

      {qrCode ? (
        <img
          src={qrCode.data.qrDataURL}
          alt="Mã QR thanh toán"
          className="h-56 w-56 rounded-lg border border-gray-200"
        />
      ) : (
        <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-gray-200">
          <Spinner className="h-6 w-6" />
        </div>
      )}

      {payment && (
        <HoldCountdown
          key={payment.id}
          expiresAt={payment.expiresAt ?? new Date().toISOString()}
          onExpire={() => paymentQuery.refetch()}
          label="Thời gian thanh toán còn lại"
        />
      )}

      <p className="text-sm text-gray-500">
        Đang chờ thanh toán — trang sẽ tự chuyển khi xác nhận thành công.
      </p>
    </div>
  );
}
