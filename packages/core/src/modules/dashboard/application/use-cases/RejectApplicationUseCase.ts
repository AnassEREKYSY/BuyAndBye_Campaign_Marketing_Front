import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class RejectApplicationUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(applicationId: string) {
    return this.repo.rejectApplication(applicationId)
  }
}