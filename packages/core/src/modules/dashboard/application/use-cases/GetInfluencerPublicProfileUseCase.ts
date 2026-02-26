import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class GetInfluencerPublicProfileUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(influencerId: string) {
    return this.repo.getInfluencerPublicProfile(influencerId)
  }
}