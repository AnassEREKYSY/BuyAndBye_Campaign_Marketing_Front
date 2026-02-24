import { IDashboardRepository, TimelineParams } from "../../domain/repositories/IDashboardRepository";

export class GetCollaborationTimelineUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(collaborationId: string, params: TimelineParams) {
    return this.repository.getCollaborationTimeline(collaborationId, params)
  }
}