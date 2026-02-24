import { Campaign } from '../../domain/entities/Campaign'
import type { ApiCampaign } from '../api/types/ApiCampaign'

export class CampaignMapper {
  static toDomain(c: ApiCampaign): Campaign {
    return {
      id: c.id,
      brandId: c.brand_id,
      productId: c.product_id,
      title: c.title,
      objective: c.objective ?? null,
      commissionType: c.commission_type,
      commissionValue: c.commission_value,
      budget: c.budget ?? null,
      startAt: c.start_at ?? null,
      endAt: c.end_at ?? null,
      status: c.status,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }
  }

  static toDomainList(items: ApiCampaign[]): Campaign[] {
    return (items ?? []).map((x) => this.toDomain(x))
  }
}