import { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";

export class GetBrandCampaignSummaryUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(campaignId: string) {
    return this.repository.getBrandCampaignSummary(campaignId)
  }
}