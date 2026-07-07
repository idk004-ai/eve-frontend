/**
 * Khớp với BaseResponse<T> của common-core (backend):
 * { status, message, data, metadata: { code, requestId, pagination } }
 */
export interface ApiMetadata {
  code?: number;
  requestId?: string;
  pagination?: {
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface BaseResponse<T> {
  status: string;
  message: string;
  data: T;
  metadata?: ApiMetadata;
}
