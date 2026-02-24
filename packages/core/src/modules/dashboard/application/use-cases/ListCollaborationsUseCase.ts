import { IDashboardRepository, ListCollaborationsParams } from "../../domain/repositories/IDashboardRepository";


export class ListCollaborationsUseCase {
  constructor(private readonly repository: IDashboardRepository) {}

  async execute(params: ListCollaborationsParams) {
    return this.repository.listCollaborations(params)
  }
}