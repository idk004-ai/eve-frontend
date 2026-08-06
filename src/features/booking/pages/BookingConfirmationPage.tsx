import { useNavigate, useParams } from "react-router-dom";
import type { BookingStatus } from "@/shared/api/types";
import { EmptyState } from "@/shared/components/EmptyState";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Skeleton } from "@/shared/ui/skeleton";
import { mockTrips } from "@/shared/mocks/trips";
import { cn } from "@/shared/lib/utils";
import { useBookingQuery } from "../hooks";
import { formatCurrencyVnd, getTripRouteLabel } from "../utils";

const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "Đang xử lý",
  PAYMENT_PENDING: "Chờ thanh toán",
  CONFIRMED: "Đã xác nhận",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã huỷ",
  EXPIRED: "Đã hết hạn",
};

const BOOKING_STATUS_BADGE_CLASS: Record<BookingStatus, string> = {
  PENDING: "bg-gray-100 text-gray-700",
  PAYMENT_PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  EXPIRED: "bg-red-100 text-red-700",
};

export function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookingQuery = useBookingQuery(id);
  const booking = bookingQuery.data;

  if (bookingQuery.isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <EmptyState
        title="Không tìm thấy vé"
        description="Vé này không tồn tại hoặc đã bị huỷ."
        action={<Button onClick={() => navigate("/lookup")}>Tra cứu vé khác</Button>}
      />
    );
  }

  const trip = mockTrips.find((t) => t.id === booking.tripId);
  const { fromName, toName } = trip
    ? getTripRouteLabel(trip)
    : { fromName: "?", toName: "?" };

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Vé {booking.bookingCode}</CardTitle>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-medium",
            BOOKING_STATUS_BADGE_CLASS[booking.status],
          )}
        >
          {BOOKING_STATUS_LABEL[booking.status]}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 text-sm">
        <div>
          <p className="font-medium text-gray-900">
            {fromName} → {toName}
          </p>
          {trip && (
            <p className="text-gray-500">
              Khởi hành: {new Date(trip.departureTime).toLocaleString("vi-VN", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 border-t border-gray-200 pt-3">
          {booking.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <span>
                Ghế {item.seatNumber}
                {item.floor ? ` (tầng ${item.floor})` : ""} — {item.fromStopName} →{" "}
                {item.toStopName}
              </span>
              <span className="font-medium text-gray-900">{formatCurrencyVnd(item.price)}</span>
            </div>
          ))}
        </div>

        <div>
          <p className="text-gray-500">Hành khách: {booking.items[0]?.passengerName}</p>
          {booking.items[0]?.passengerPhone && (
            <p className="text-gray-500">SĐT: {booking.items[0].passengerPhone}</p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="font-medium text-gray-900">Tổng tiền</span>
          <span className="text-lg font-semibold text-brand-700">
            {formatCurrencyVnd(booking.totalAmount)}
          </span>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={() => navigate("/lookup")}>
            Tra cứu vé khác
          </Button>
          <Button className="flex-1" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
