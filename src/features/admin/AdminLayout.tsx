import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Building2,
  Bus,
  BusFront,
  CalendarClock,
  CalendarDays,
  LayoutDashboard,
  Menu,
  Route as RouteIcon,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";

const NAV_ITEMS = [
  { to: "/admin", label: "Tổng quan", icon: LayoutDashboard, end: true },
  { to: "/admin/operators", label: "Nhà xe", icon: Building2 },
  { to: "/admin/bus-types", label: "Loại xe", icon: Bus },
  { to: "/admin/buses", label: "Xe", icon: BusFront },
  { to: "/admin/routes", label: "Tuyến", icon: RouteIcon },
  { to: "/admin/schedules", label: "Lịch chạy", icon: CalendarClock },
  { to: "/admin/trips", label: "Chuyến", icon: CalendarDays },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-brand-600 text-white"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            )
          }
        >
          <Icon className="h-4 w-4 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - desktop */}
      <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-gray-200 px-4">
          <Link to="/admin" className="flex items-center gap-2 font-semibold text-brand-700">
            <BusFront className="h-5 w-5" />
            EVE Admin
          </Link>
        </div>
        <SidebarNav />
      </aside>

      {/* Sidebar - mobile drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex h-full w-60 flex-col bg-white shadow-xl">
            <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
              <span className="flex items-center gap-2 font-semibold text-brand-700">
                <BusFront className="h-5 w-5" />
                EVE Admin
              </span>
              <button
                type="button"
                aria-label="Đóng menu"
                onClick={() => setMobileNavOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center gap-3 border-b border-gray-200 bg-white px-4">
          <button
            type="button"
            aria-label="Mở menu"
            onClick={() => setMobileNavOpen(true)}
            className="text-gray-500 hover:text-gray-900 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-semibold text-gray-900">Portal nhà xe</span>
          <div className="ml-auto">
            <Link to="/" className="text-sm text-gray-500 hover:text-brand-700">
              Về trang khách
            </Link>
          </div>
        </header>
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
