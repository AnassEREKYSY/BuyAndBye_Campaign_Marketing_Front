import { IDashboardRepository } from "../../domain/repositories/IDashboardRepository";

export class ListInfluencerPayoutsUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute() {
    return this.repository.listInfluencerPayouts()
  }
}