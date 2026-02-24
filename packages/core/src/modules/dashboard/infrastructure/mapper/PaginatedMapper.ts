import { Paginated } from '../../domain/entities'
import { ApiPaginated, ApiPaginatedMeta } from '../api/types'

function metaOrDefault(meta: ApiPaginatedMeta | undefined, page: number, size: number, count: number) {
  if (!meta) {
    return { page, size, total: count, lastPage: page }
  }
  return {
    page: meta.current_page ?? page,
    size: meta.per_page ?? size,
    total: meta.total ?? count,
    lastPage: meta.last_page ?? page,
  }
}

export class PaginatedMapper {
  static toDomain<TApi, TDomain>(
    api: ApiPaginated<TApi>,
    mapItem: (item: TApi) => TDomain,
    page: number,
    size: number
  ): Paginated<TDomain> {
    const items = (api.data ?? []).map(mapItem)
    return { items, meta: metaOrDefault(api.meta, page, size, items.length) }
  }
}