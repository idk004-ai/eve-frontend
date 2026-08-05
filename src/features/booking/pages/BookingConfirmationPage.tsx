import { useParams } from "react-router-dom";

export function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="text-gray-600">
      <h1 className="text-xl font-semibold text-gray-900">Xác nhận đặt vé</h1>
      <p className="mt-2 text-sm">Đang xây dựng — xem Phase 2 (Track D) trong kế hoạch.</p>
      <p className="mt-1 text-xs text-gray-400">bookingId={id}</p>
    </div>
  );
}
