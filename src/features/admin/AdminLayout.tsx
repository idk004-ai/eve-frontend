import { Link, Outlet } from "react-router-dom";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center border-b border-gray-200 bg-white px-4">
        <Link to="/admin" className="font-semibold text-brand-700">
          EVE Admin
        </Link>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
