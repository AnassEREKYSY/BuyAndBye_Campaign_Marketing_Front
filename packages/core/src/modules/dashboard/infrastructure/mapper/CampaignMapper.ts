import { Campaign } from '../../domain/entities/Campaign'
import type { ApiCampaign } from '../api/types/ApiCampaign'
import { ProductMapper } from './ProductMapper'

export class CampaignMapper {
  static toDomain(api: ApiCampaign): Campaign {
    return new Campaign(
      api.id,
      api.brand_id,
      api.product_id,
      api.title,
      api.objective ?? null,
      api.commission_type,
      Number(api.commission_value ?? 0),
      api.budget !== null && api.budget !== undefined ? Number(api.budget) : null,
      api.start_at ?? null,
      api.end_at ?? null,
      api.status,
      api.product ? ProductMapper.toDomain(api.product as any) : null,
      api.applications_count ?? null,
      api.created_at ?? null,
      api.updated_at ?? null,
    )
  }

  static toDomainList(items: ApiCampaign[]): Campaign[] {
    return (items ?? []).map((i) => CampaignMapper.toDomain(i))
  }
}