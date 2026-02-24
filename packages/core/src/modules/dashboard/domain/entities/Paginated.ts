export type PaginatedMeta = {
  page: number
  size: number
  total: number
  lastPage: number
}

export type Paginated<T> = {
  items: T[]
  meta: PaginatedMeta
}