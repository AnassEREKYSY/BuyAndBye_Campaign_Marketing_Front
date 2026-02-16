import { IProductRepository } from '@core/modules/products/domain/repositories/IProductRepository' 
import { UpdateProductDTO } from '@core/modules/products/domain/dtos/UpdateProductDTO' 
import { Product } from '@core/modules/products/domain/entities/Product' 

export class UpdateProductUseCase {
  constructor(private repository: IProductRepository) {}

  execute(payload: UpdateProductDTO): Promise<Product> {
    return this.repository.updateProduct(payload)
  }
}
