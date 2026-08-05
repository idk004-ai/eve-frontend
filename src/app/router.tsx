import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    // Khu vực khách (/)
    children: [
      {
        path: "/login",
        lazy: () =>
          import("@/features/auth/pages/LoginPage").then((m) => ({ Component: m.LoginPage })),
      },
      {
        path: "/register",
        lazy: () =>
          import("@/features/auth/pages/RegisterPage").then((m) => ({
            Component: m.RegisterPage,
          })),
      },
      {
        lazy: () =>
          import("@/shared/components/AppLayout").then((m) => ({ Component: m.AppLayout })),
        children: [
          {
            path: "/",
            lazy: () =>
              import("@/features/trips/pages/HomePage").then((m) => ({ Component: m.HomePage })),
          },
          {
            path: "/search",
            lazy: () =>
              import("@/features/search/pages/SearchResultsPage").then((m) => ({
                Component: m.SearchResultsPage,
              })),
          },
          {
            path: "/trips/:tripId/seats",
            lazy: () =>
              import("@/features/booking/pages/SeatSelectionPage").then((m) => ({
                Component: m.SeatSelectionPage,
              })),
          },
          {
            path: "/bookings/:id/payment",
            lazy: () =>
              import("@/features/booking/pages/PaymentPage").then((m) => ({
                Component: m.PaymentPage,
              })),
          },
          {
            path: "/bookings/:id",
            lazy: () =>
              import("@/features/booking/pages/BookingConfirmationPage").then((m) => ({
                Component: m.BookingConfirmationPage,
              })),
          },
          {
            path: "/lookup",
            lazy: () =>
              import("@/features/booking/pages/BookingLookupPage").then((m) => ({
                Component: m.BookingLookupPage,
              })),
          },
          {
            element: <ProtectedRoute />,
            children: [
              // route cần đăng nhập (my bookings, profile...)
            ],
          },
        ],
      },
    ],
  },
  {
    // Khu vực admin (/admin), tách bundle riêng với khu vực khách
    path: "/admin",
    lazy: () => import("@/features/admin/AdminLayout").then((m) => ({ Component: m.AdminLayout })),
    children: [
      {
        index: true,
        lazy: () =>
          import("@/features/admin/pages/AdminHomePage").then((m) => ({
            Component: m.AdminHomePage,
          })),
      },
      {
        path: "operators",
        lazy: () =>
          import("@/features/admin/pages/OperatorsPage").then((m) => ({
            Component: m.OperatorsPage,
          })),
      },
      {
        path: "bus-types",
        lazy: () =>
          import("@/features/admin/pages/BusTypesPage").then((m) => ({
            Component: m.BusTypesPage,
          })),
      },
      {
        path: "buses",
        lazy: () =>
          import("@/features/admin/pages/BusesPage").then((m) => ({ Component: m.BusesPage })),
      },
      {
        path: "routes",
        lazy: () =>
          import("@/features/admin/pages/RoutesPage").then((m) => ({ Component: m.RoutesPage })),
      },
      {
        path: "schedules",
        lazy: () =>
          import("@/features/admin/pages/SchedulesPage").then((m) => ({
            Component: m.SchedulesPage,
          })),
      },
      {
        path: "trips",
        lazy: () =>
          import("@/features/admin/pages/TripsPage").then((m) => ({ Component: m.TripsPage })),
      },
    ],
  },
]);
