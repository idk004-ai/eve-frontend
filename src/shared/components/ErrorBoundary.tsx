import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Chưa bọc vào providers.tsx (xem Ghi chú Track A trong kế hoạch) — component
 * độc lập, ai wiring vào app thì bọc quanh <RouterProvider/> hoặc từng route.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <p className="text-lg font-semibold text-gray-900">Đã có lỗi xảy ra</p>
            <p className="text-sm text-gray-500">Vui lòng tải lại trang hoặc thử lại sau.</p>
            <Button onClick={() => window.location.reload()}>
              <RefreshCw className="h-4 w-4" />
              Tải lại trang
            </Button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
