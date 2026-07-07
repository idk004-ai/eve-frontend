import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/shared/components/AppLayout";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { RegisterPage } from "@/features/auth/pages/RegisterPage";
import { HomePage } from "@/features/trips/pages/HomePage";

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      // Các feature sau sẽ thêm route tại đây:
      // /trips/:tripId/seats  → seat selection (WebSocket)
      // /bookings/:id/payment → payment + grace period countdown
      // /operator/**          → operator dashboard
      {
        element: <ProtectedRoute />,
        children: [
          // route cần đăng nhập (my bookings, profile...)
        ],
      },
    ],
  },
]);
