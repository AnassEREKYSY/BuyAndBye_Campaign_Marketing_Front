import type { UpdateCampaignDTO } from '../../domain/dtos/UpdateCampaignDTO'
import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class UpdateCampaignUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(id: string, dto: UpdateCampaignDTO) {
    return this.repo.updateCampaign(id, dto)
  }
}