import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class DeleteProductUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(id: string) {
    return this.repo.deleteProduct(id)
  }
}