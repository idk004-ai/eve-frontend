import { Link } from "react-router-dom";
import { BusFront, Mail, MessageCircle, Phone, Share2 } from "lucide-react";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Liên kết nhanh",
    links: [
      { label: "Trang chủ", to: "/" },
      { label: "Tra cứu vé", to: "/lookup" },
    ],
  },
  {
    title: "Hỗ trợ khách hàng",
    links: [
      { label: "Câu hỏi thường gặp", to: "/faq" },
      { label: "Chính sách đổi/trả vé", to: "/policy" },
      { label: "Điều khoản sử dụng", to: "/terms" },
    ],
  },
  {
    title: "Về Eve",
    links: [
      { label: "Giới thiệu", to: "/about" },
      { label: "Tuyển dụng", to: "/careers" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 text-lg font-bold text-brand-700">
            <BusFront className="h-5 w-5" />
            Eve
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Đặt vé xe khách trực tuyến — tìm chuyến, chọn ghế realtime, thanh toán QR trong vài
            phút.
          </p>
          <div className="mt-3 flex items-center gap-3 text-gray-400">
            <Share2 className="h-4 w-4" />
            <MessageCircle className="h-4 w-4" />
          </div>
        </div>

        {COLUMNS.map((column) => (
          <div key={column.title}>
            <h3 className="text-sm font-semibold text-gray-900">{column.title}</h3>
            <ul className="mt-3 flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-gray-500 hover:text-brand-700">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold text-gray-900">Liên hệ</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-gray-500">
            <li className="flex items-center gap-1.5">
              <Phone className="h-4 w-4" />
              1900 6789
            </li>
            <li className="flex items-center gap-1.5">
              <Mail className="h-4 w-4" />
              hotro@eve.vn
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Eve. Đã đăng ký bản quyền.
      </div>
    </footer>
  );
}
