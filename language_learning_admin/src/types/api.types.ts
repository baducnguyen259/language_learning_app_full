export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export interface ApiError {
  message: string
  code?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
