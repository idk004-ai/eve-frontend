import { api } from "@/shared/api/http";
import type { BaseResponse } from "@/shared/api/types";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "./types";

/**
 * Contract REST dự kiến của user-service (hiện backend mới có gRPC).
 * Khi user-service expose REST thật, chỉ cần chỉnh path tại đây.
 */
function unwrap<T>(response: BaseResponse<T>): T {
  if (response.data === null) {
    throw new Error(response.message ?? "Backend trả về data rỗng");
  }
  return response.data;
}

export const authApi = {
  login: async (body: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<BaseResponse<AuthResponse>>("/api/user/auth/login", body);
    return unwrap(data);
  },

  register: async (body: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<BaseResponse<AuthResponse>>("/api/user/auth/register", body);
    return unwrap(data);
  },

  me: async (): Promise<User> => {
    const { data } = await api.get<BaseResponse<User>>("/api/user/users/me");
    return unwrap(data);
  },
};
