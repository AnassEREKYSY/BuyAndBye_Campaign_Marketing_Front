import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository' 
import { CreateProductDTO } from '@core/modules/products/domain/dtos/CreateProductDTO' 
import { Product } from '@core/modules/products/domain/entities/Product'

export class CreateProductUseCase {
  constructor(private repo: IProductRepository) {}

  execute(payload: CreateProductDTO): Promise<Product> {
    return this.repo.createProduct(payload)
  }
}