import type { CreateProductDTO } from '../../domain/dtos/CreateProductDTO'
import type { IDashboardRepository } from '../../domain/repositories/IDashboardRepository'

export class CreateProductUseCase {
  constructor(private readonly repo: IDashboardRepository) {}

  execute(dto: CreateProductDTO) {
    return this.repo.createProduct(dto)
  }
}