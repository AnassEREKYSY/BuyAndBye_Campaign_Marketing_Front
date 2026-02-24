import { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";

export class GetInfluencerDashboardUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute() {
    return this.repository.getInfluencerDashboard()
  }
}