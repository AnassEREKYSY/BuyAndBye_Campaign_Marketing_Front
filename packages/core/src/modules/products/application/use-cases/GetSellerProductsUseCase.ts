import { IProductRepository } from "../../domain/repositories/IProductRepository"

export class GetSellerProductsUseCase {
  constructor(private repository: IProductRepository) {}

  execute(page?: number, pageSize?: number) {
    return this.repository.getSellerProducts(page, pageSize)
  }
}