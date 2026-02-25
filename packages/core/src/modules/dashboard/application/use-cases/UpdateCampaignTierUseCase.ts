import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'
import type { CampaignPayoutTier } from '../../domain/entities/CampaignPayoutTier'
import type { UpdateCampaignPayoutTierDTO } from '../../domain/dtos'

export class UpdateCampaignTierUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(tierId: string, dto: UpdateCampaignPayoutTierDTO): Promise<CampaignPayoutTier> {
    return this.repo.updateCampaignTier(tierId, dto)
  }
}