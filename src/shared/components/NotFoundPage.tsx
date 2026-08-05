import { Link } from "react-router-dom";
import { Home } from "lucide-react";

/** Chưa gắn `errorElement`/catch-all route (xem Ghi chú Track A trong kế hoạch). */
export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <p className="text-6xl font-bold text-brand-600">404</p>
      <p className="text-lg font-semibold text-gray-900">Không tìm thấy trang</p>
      <p className="text-sm text-gray-500">Trang bạn tìm không tồn tại hoặc đã bị di chuyển.</p>
      <Link
        to="/"
        className="mt-2 inline-flex h-10 items-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
      >
        <Home className="h-4 w-4" />
        Về trang chủ
      </Link>
    </div>
  );
}
