import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'
import type { CampaignPayoutTier } from '../../domain/entities/CampaignPayoutTier'

export class ListCampaignTiersUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(campaignId: string): Promise<CampaignPayoutTier[]> {
    return this.repo.listCampaignTiers(campaignId)
  }
}