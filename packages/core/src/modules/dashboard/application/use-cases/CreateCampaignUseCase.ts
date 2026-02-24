import type { CreateCampaignDTO } from '../../domain/dtos/CreateCampaignDTO'
import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class CreateCampaignUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(dto: CreateCampaignDTO) {
    return this.repo.createCampaign(dto)
  }
}