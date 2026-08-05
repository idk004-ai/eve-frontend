import { useSearchParams } from "react-router-dom";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();

  return (
    <div className="text-gray-600">
      <h1 className="text-xl font-semibold text-gray-900">Kết quả tìm chuyến</h1>
      <p className="mt-2 text-sm">Đang xây dựng — xem Phase 1 (Track C) trong kế hoạch.</p>
      <p className="mt-1 text-xs text-gray-400">
        from={searchParams.get("from")} · to={searchParams.get("to")} · date=
        {searchParams.get("date")}
      </p>
    </div>
  );
}
