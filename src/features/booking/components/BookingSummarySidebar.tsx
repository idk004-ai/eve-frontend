import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Spinner } from "@/shared/ui/spinner";
import type { SelectedSeat } from "../store";
import { formatCurrencyVnd, type StopOptionVM } from "../utils";

interface BookingSummarySidebarProps {
  fromName: string;
  toName: string;
  departureTime: string;
  selectedSeats: SelectedSeat[];
  pickup: StopOptionVM | null;
  dropoff: StopOptionVM | null;
  totalAmount: number;
  /** Lý do chưa thể đặt vé (chưa chọn ghế/giữ ghế hết hạn/chưa điền đủ thông tin...), null = sẵn sàng. */
  blockedReason: string | null;
  isSubmitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
}

export function BookingSummarySidebar({
  fromName,
  toName,
  departureTime,
  selectedSeats,
  pickup,
  dropoff,
  totalAmount,
  blockedReason,
  isSubmitting,
  submitError,
  onSubmit,
}: BookingSummarySidebarProps) {
  const departureLabel = new Date(departureTime).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });

  return (
    <Card className="h-fit w-full lg:w-80">
      <CardHeader>
        <CardTitle>Tóm tắt đơn</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        <div>
          <p className="font-medium text-gray-900">
            {fromName} → {toName}
          </p>
          <p className="text-gray-500">Khởi hành: {departureLabel}</p>
        </div>

        <div>
          <p className="font-medium text-gray-900">
            Ghế ({selectedSeats.length}
            {selectedSeats.length > 0 &&
              `: ${selectedSeats.map((s) => s.seatNumber).join(", ")}`}
            )
          </p>
        </div>

        <div>
          <p className="text-gray-500">
            Đón: <span className="text-gray-900">{pickup ? `${pickup.time} — ${pickup.name}` : "—"}</span>
          </p>
          <p className="text-gray-500">
            Trả: <span className="text-gray-900">{dropoff ? `${dropoff.time} — ${dropoff.name}` : "—"}</span>
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-3">
          <span className="font-medium text-gray-900">Tổng tiền</span>
          <span className="text-lg font-semibold text-brand-700">
            {formatCurrencyVnd(totalAmount)}
          </span>
        </div>

        {blockedReason && <p className="text-xs text-amber-700">{blockedReason}</p>}
        {submitError && <p className="text-xs text-red-600">{submitError}</p>}

        <Button
          type="button"
          disabled={!!blockedReason || isSubmitting}
          onClick={onSubmit}
          className="w-full"
        >
          {isSubmitting && <Spinner />}
          Tiếp tục đặt vé
        </Button>
      </CardContent>
    </Card>
  );
}
