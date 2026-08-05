import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BusFront, Globe, LogOut, Phone, Ticket, UserRound } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/shared/ui/button";

const HOTLINE = "1900 6789";

const LANGUAGES = [
  { code: "vi", label: "VI" },
  { code: "en", label: "EN" },
] as const;

export function Header() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  // Chỉ đổi label tại chỗ, chưa nối i18n thật — xem Phase 4 "i18n tiếng Việt hoàn chỉnh".
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]["code"]>("vi");

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
          <BusFront className="h-6 w-6" />
          Eve
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-gray-600 sm:flex">
          <Link to="/lookup" className="flex items-center gap-1.5 hover:text-brand-700">
            <Ticket className="h-4 w-4" />
            Tra cứu vé
          </Link>
          <a href={`tel:${HOTLINE.replace(/\s/g, "")}`} className="flex items-center gap-1.5">
            <Phone className="h-4 w-4" />
            {HOTLINE}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center overflow-hidden rounded-md border border-gray-200 text-xs">
            {LANGUAGES.map(({ code, label }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLanguage(code)}
                aria-pressed={language === code}
                className={
                  "flex items-center gap-1 px-2 py-1.5 transition-colors " +
                  (language === code
                    ? "bg-brand-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50")
                }
              >
                {code === "vi" && <Globe className="h-3.5 w-3.5" />}
                {label}
              </button>
            ))}
          </div>

          {user ? (
            <>
              <span className="hidden items-center gap-1.5 text-sm text-gray-600 md:flex">
                <UserRound className="h-4 w-4" />
                {user.fullName ?? user.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Đăng nhập
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Đăng ký
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
