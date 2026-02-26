import type { ApiCampaignApplication } from '../api/types/ApiCampaignApplication'
import type { ApplicationStatus, ApplicantSummary } from '../../domain/entities'
import { CampaignApplication } from '../../domain/entities'

export class CampaignApplicationMapper {
  static toDomain(api: ApiCampaignApplication): CampaignApplication {
    const influencer: ApplicantSummary | null = api.influencer
      ? {
          id: api.influencer.id,
          displayName: api.influencer.display_name,
          photoUrl: api.influencer.photo_url ?? null,
        }
      : null

    return new CampaignApplication(
      api.id,
      api.campaign_id,
      api.influencer_id,
      api.message ?? null,
      api.status as ApplicationStatus,
      influencer,
      api.created_at ?? null,
      api.updated_at ?? null
    )
  }

  static toDomainList(items: ApiCampaignApplication[]): CampaignApplication[] {
    return items.map((x) => CampaignApplicationMapper.toDomain(x))
  }
}