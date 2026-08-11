export interface ApiResponse<T> {
  success: true;
  data: T;
  path: string;
  timestamp: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface ApiErrorDetail {
  statusCode: number;
  message: string | string[];
  type?: string;
}

export interface ApiError {
  success: false;
  error: ApiErrorDetail;
  path: string;
  timestamp: string;
}
