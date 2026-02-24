import { IDashboardRepository, ListCampaignsParams, } from "../../domain/repositories/IDashboardRepository";

export class ListCampaignsUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(params: ListCampaignsParams) {
    return this.repository.listCampaigns(params)
  }
}