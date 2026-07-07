import { Link, Outlet, useNavigate } from "react-router-dom";
import { BusFront, LogOut, UserRound } from "lucide-react";
import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/shared/ui/button";

export function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-brand-700">
            <BusFront className="h-6 w-6" />
            Eve
          </Link>
          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <span className="flex items-center gap-1.5 text-sm text-gray-600">
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
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 text-center text-sm text-gray-500">
        Eve — Hệ thống đặt vé xe khách
      </footer>
    </div>
  );
}
