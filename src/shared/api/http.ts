import axios, { type AxiosInstance } from "axios";
import { useAuthStore } from "@/features/auth/store";

/**
 * Mỗi service backend có 1 axios instance riêng (chưa có API gateway).
 * Tất cả dùng chung interceptor gắn JWT + xử lý 401.
 */
function createHttp(baseURL: string): AxiosInstance {
  const http = axios.create({ baseURL, timeout: 15_000 });

  http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  http.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    },
  );

  return http;
}

export const userApi = createHttp(import.meta.env.VITE_USER_API_URL);
export const routeApi = createHttp(import.meta.env.VITE_ROUTE_API_URL);
export const bookingApi = createHttp(import.meta.env.VITE_BOOKING_API_URL);
export const paymentApi = createHttp(import.meta.env.VITE_PAYMENT_API_URL);
export const seatInventoryApi = createHttp(import.meta.env.VITE_SEAT_INVENTORY_API_URL);
export const fleetApi = createHttp(import.meta.env.VITE_FLEET_API_URL);
