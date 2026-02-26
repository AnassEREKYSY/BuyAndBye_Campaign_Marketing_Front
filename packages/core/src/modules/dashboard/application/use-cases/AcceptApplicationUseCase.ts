import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class AcceptApplicationUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(applicationId: string) {
    return this.repo.acceptApplication(applicationId)
  }
}