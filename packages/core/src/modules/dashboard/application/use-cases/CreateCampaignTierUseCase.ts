import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'
import type { CampaignPayoutTier } from '../../domain/entities/CampaignPayoutTier'
import type { CreateCampaignPayoutTierDTO } from '../../domain/dtos'

export class CreateCampaignTierUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(campaignId: string, dto: CreateCampaignPayoutTierDTO): Promise<CampaignPayoutTier> {
    return this.repo.createCampaignTier(campaignId, dto)
  }
}