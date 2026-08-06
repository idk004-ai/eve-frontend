import { api } from "@/shared/api/http";
import type { BaseResponse, Location } from "@/shared/api/types";

function unwrap<T>(response: BaseResponse<T>): T {
  if (response.data === null) {
    throw new Error(response.message ?? "Backend trả về data rỗng");
  }
  return response.data;
}

/**
 * Response thật của route-service `/locations` hiện chỉ có `id`/`name`
 * (thiếu city/province/region so với `Location` trong types.ts) — chỉ đọc
 * 2 field này, không phụ thuộc city/province/region.
 */
export const homeApi = {
  locations: async (): Promise<Location[]> => {
    const { data } = await api.get<BaseResponse<Location[]>>("/api/route/locations");
    return unwrap(data);
  },
};
