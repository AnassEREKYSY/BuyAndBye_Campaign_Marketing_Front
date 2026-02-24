import { IDashboardRepository, TimelineParams } from "../../domain/repositories/IDashboardRepository";

export class GetBrandCampaignTimelineUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(campaignId: string, params: TimelineParams) {
    return this.repository.getBrandCampaignTimeline(campaignId, params)
  }
}