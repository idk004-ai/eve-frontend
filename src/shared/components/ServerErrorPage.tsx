import { ServerCrash } from "lucide-react";
import { Button } from "@/shared/ui/button";

/** Chưa gắn `errorElement`/catch-all route (xem Ghi chú Track A trong kế hoạch). */
export function ServerErrorPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      <ServerCrash className="h-10 w-10 text-red-500" />
      <p className="text-6xl font-bold text-brand-600">500</p>
      <p className="text-lg font-semibold text-gray-900">Lỗi hệ thống</p>
      <p className="text-sm text-gray-500">Có lỗi xảy ra phía máy chủ. Vui lòng thử lại sau.</p>
      <Button onClick={() => window.location.reload()}>Thử lại</Button>
    </div>
  );
}
