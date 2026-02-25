import type { ApiCampaignPayoutTier } from '../api/types/ApiCampaignPayoutTier'
import { CampaignPayoutTier } from '../../domain/entities/CampaignPayoutTier'

export class CampaignPayoutTierMapper {
  static toDomain(api: ApiCampaignPayoutTier): CampaignPayoutTier {
    return new CampaignPayoutTier(
      api.id,
      api.campaign_id,
      api.metric,
      Number(api.from_value ?? 0),
      api.to_value !== null && api.to_value !== undefined ? Number(api.to_value) : null,
      Number(api.payout_amount ?? 0),
      api.currency ?? null,
      api.created_at ?? null,
      api.updated_at ?? null,
    )
  }

  static toDomainList(items: ApiCampaignPayoutTier[]): CampaignPayoutTier[] {
    return (items ?? []).map((i) => CampaignPayoutTierMapper.toDomain(i))
  }
}