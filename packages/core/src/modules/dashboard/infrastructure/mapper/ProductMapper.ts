import { Product } from '../../domain/entities/Product'
import type { ApiProduct } from '../api/types/ApiProduct'

export class ProductMapper {
  static toDomain(api: ApiProduct): Product {
    return new Product(
      api.id,
      api.brand_id,
      api.name,
      api.description,
      api.price ?? null,
      api.currency ?? null,
      api.landing_url ?? null,
      api.status,
      api.images ?? [],
      api.created_at ?? null,
      api.updated_at ?? null,
    )
  }

  static toDomainList(items: ApiProduct[]): Product[] {
    return (items ?? []).map((i) => ProductMapper.toDomain(i))
  }
}