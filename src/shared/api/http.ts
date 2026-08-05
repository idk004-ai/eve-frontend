import axios from "axios";
import { useAuthStore } from "@/features/auth/store";
import type { BaseResponse } from "./types";

declare module "axios" {
  interface AxiosError {
    /**
     * Message đã chuẩn hóa (ưu tiên `BaseResponse.message` từ backend, fallback
     * `error.message`) — interceptor chung gắn sẵn, dùng thay vì mỗi nơi tự
     * `isAxiosError(e) && e.response?.data?.message`.
     */
    userMessage?: string;
  }
}

/**
 * 1 axios instance dùng chung cho toàn bộ FE, baseURL để trống — mọi call dùng
 * path tuyệt đối dạng `/api/<service>/...`. Dev: Vite proxy (vite.config.ts)
 * forward sang từng service (port-forward), bỏ prefix. Prod: nginx (nginx.conf)
 * reverse-proxy cùng scheme `/api/<service>/`. Nhờ path scheme giống nhau ở cả
 * 2 môi trường nên không cần env base URL riêng cho từng service.
 */
export const api = axios.create({ baseURL: "/", timeout: 15_000 });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    if (axios.isAxiosError(error)) {
      const body = error.response?.data as BaseResponse<unknown> | undefined;
      error.userMessage = body?.message ?? error.message ?? "Có lỗi xảy ra, vui lòng thử lại";
    }
    return Promise.reject(error);
  },
);
