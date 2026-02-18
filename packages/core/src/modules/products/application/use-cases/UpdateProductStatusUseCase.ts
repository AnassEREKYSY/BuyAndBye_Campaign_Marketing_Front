import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository'
import { ProductStatus } from '@core/modules/products/domain/entities/ProductStatus'

export class UpdateProductStatusUseCase {
  constructor(private readonly repository: IProductRepository) {}

  async execute(productId: string, status: ProductStatus) {
    return this.repository.updateStatus(productId, status)
  }
}