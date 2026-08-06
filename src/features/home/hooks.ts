import { useQuery } from "@tanstack/react-query";
import { homeApi } from "./api";

/** Fetch danh mục điểm đi/đến 1 lần — Combobox filter client-side khi gõ. */
export function useLocations() {
  return useQuery({
    queryKey: ["route", "locations"],
    queryFn: homeApi.locations,
    staleTime: 10 * 60_000,
  });
}
