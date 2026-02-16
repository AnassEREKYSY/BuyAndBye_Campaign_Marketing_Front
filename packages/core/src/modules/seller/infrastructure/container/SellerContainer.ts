import { HttpClient } from "@core/shared/services/http/HttpClient" 
import { ProductRepository } from "@core/modules/products/infrastructure/repositories/ProductRepository" 
import { GetSellerProductsUseCase } from "@core/modules/products/application/use-cases/GetSellerProductsUseCase"
import { CreateProductUseCase } from "@core/modules/products/application/use-cases/CreateProductUseCase"
import { UpdateProductUseCase } from "@core/modules/products/application/use-cases/UpdateProductUseCase"
import { DeleteProductUseCase } from "@core/modules/products/application/use-cases/DeleteProductUseCase"
import { UpdateProductStatusUseCase } from "@core/modules/products/application/use-cases/UpdateProductStatusUseCase"

export class SellerContainer {
  private static instance: SellerContainer

  public getSellerProductsUseCase: GetSellerProductsUseCase
  public createProductUseCase: CreateProductUseCase
  public updateProductUseCase: UpdateProductUseCase
  public deleteProductUseCase: DeleteProductUseCase
  public updateProductStatusUseCase: UpdateProductStatusUseCase

  private constructor(httpClient: HttpClient, backendBaseUrl: string) {
    const productRepository = new ProductRepository(httpClient, backendBaseUrl)
    this.getSellerProductsUseCase = new GetSellerProductsUseCase(productRepository)
    this.createProductUseCase = new CreateProductUseCase(productRepository)
    this.updateProductUseCase = new UpdateProductUseCase(productRepository)
    this.deleteProductUseCase = new DeleteProductUseCase(productRepository)
    this.updateProductStatusUseCase = new UpdateProductStatusUseCase(productRepository)
  }

  static getInstance(httpClient: HttpClient, backendBaseUrl: string) {
    if (!this.instance) {
      this.instance = new SellerContainer(httpClient, backendBaseUrl)
    }
    return this.instance
  }
}