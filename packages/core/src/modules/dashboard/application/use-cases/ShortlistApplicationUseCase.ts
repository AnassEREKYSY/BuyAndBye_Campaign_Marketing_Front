import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class ShortlistApplicationUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(applicationId: string) {
    return this.repo.shortlistApplication(applicationId)
  }
}