import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'
import type { ListCampaignApplicationsParams } from '../../domain/repositories/IDashboardRepository'

export class ListBrandCampaignApplicationsUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(campaignId: string, params: ListCampaignApplicationsParams) {
    return this.repo.listBrandCampaignApplications(campaignId, params)
  }
}