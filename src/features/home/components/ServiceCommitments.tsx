import type { LucideIcon } from "lucide-react";
import { Headset, RefreshCw, ShieldCheck, Zap } from "lucide-react";

interface Commitment {
  icon: LucideIcon;
  title: string;
  description: string;
}

const commitments: Commitment[] = [
  {
    icon: Zap,
    title: "Đặt vé nhanh chóng",
    description: "Tìm chuyến, chọn ghế và thanh toán chỉ trong vài phút",
  },
  {
    icon: ShieldCheck,
    title: "Thanh toán an toàn",
    description: "Quét mã QR, bảo mật theo tiêu chuẩn ngân hàng",
  },
  {
    icon: RefreshCw,
    title: "Đổi/trả vé linh hoạt",
    description: "Chủ động thay đổi kế hoạch di chuyển của bạn",
  },
  {
    icon: Headset,
    title: "Hỗ trợ 24/7",
    description: "Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ",
  },
];

export function ServiceCommitments() {
  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {commitments.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <Icon className="h-6 w-6" />
          </span>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      ))}
    </section>
  );
}
