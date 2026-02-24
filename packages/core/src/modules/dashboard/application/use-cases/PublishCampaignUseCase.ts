import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class PublishCampaignUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(id: string) {
    return this.repo.publishCampaign(id)
  }
}