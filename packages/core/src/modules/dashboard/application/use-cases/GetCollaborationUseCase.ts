import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'
import type { Collaboration } from '../../domain/entities/Collaboration'

export class GetCollaborationUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(id: string): Promise<Collaboration> {
    return this.repo.getCollaboration(id)
  }
}