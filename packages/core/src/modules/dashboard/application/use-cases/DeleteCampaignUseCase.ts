import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class DeleteCampaignUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(id: string) {
    return this.repo.deleteCampaign(id)
  }
}