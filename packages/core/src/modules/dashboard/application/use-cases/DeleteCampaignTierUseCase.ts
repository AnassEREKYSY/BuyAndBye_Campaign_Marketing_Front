import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class DeleteCampaignTierUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(tierId: string): Promise<void> {
    return this.repo.deleteCampaignTier(tierId)
  }
}