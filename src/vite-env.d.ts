/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_USER_API_URL: string;
  readonly VITE_ROUTE_API_URL: string;
  readonly VITE_BOOKING_API_URL: string;
  readonly VITE_PAYMENT_API_URL: string;
  readonly VITE_SEAT_INVENTORY_API_URL: string;
  readonly VITE_FLEET_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
