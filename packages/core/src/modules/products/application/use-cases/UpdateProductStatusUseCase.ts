import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository'

export class UpdateProductStatusUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(productId: string, status: string) {
    return this.repository.updateStatus(productId, status)
  }
}