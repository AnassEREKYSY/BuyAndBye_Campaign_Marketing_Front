import type { UpdateProductDTO } from '../../domain/dtos/UpdateProductDTO'
import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class UpdateProductUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(id: string, dto: UpdateProductDTO) {
    return this.repo.updateProduct(id, dto)
  }
}