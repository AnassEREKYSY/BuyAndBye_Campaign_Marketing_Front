export type ApiPaginatedMeta = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export type ApiPaginated<T> = {
  data: T[]
  meta?: ApiPaginatedMeta
}