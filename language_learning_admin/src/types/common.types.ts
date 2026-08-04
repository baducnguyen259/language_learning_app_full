export type EntityId = string | number

export interface SelectOption<TValue = string> {
  label: string
  value: TValue
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
}
