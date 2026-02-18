import { HttpClient } from "@core/shared/services/http/HttpClient"
import { ProductRepository } from "@core/modules/products/infrastructure/repositories/ProductRepository"
import { GetSellerProductsUseCase } from "@core/modules/products/application/use-cases/GetSellerProductsUseCase"
import { CreateProductUseCase } from "@core/modules/products/application/use-cases/CreateProductUseCase"
import { UpdateProductUseCase } from "@core/modules/products/application/use-cases/UpdateProductUseCase"
import { DeleteProductUseCase } from "@core/modules/products/application/use-cases/DeleteProductUseCase"
import { UpdateProductStatusUseCase } from "@core/modules/products/application/use-cases/UpdateProductStatusUseCase"

export class SellerContainer {
  private static instance: SellerContainer | null = null
  private static signature: string | null = null

  public readonly getSellerProductsUseCase: GetSellerProductsUseCase
  public readonly createProductUseCase: CreateProductUseCase
  public readonly updateProductUseCase: UpdateProductUseCase
  public readonly deleteProductUseCase: DeleteProductUseCase
  public readonly updateProductStatusUseCase: UpdateProductStatusUseCase

  private constructor(httpClient: HttpClient, backendBaseUrl: string) {
    const productRepository = new ProductRepository(httpClient, backendBaseUrl)
    this.getSellerProductsUseCase = new GetSellerProductsUseCase(productRepository)
    this.createProductUseCase = new CreateProductUseCase(productRepository)
    this.updateProductUseCase = new UpdateProductUseCase(productRepository)
    this.deleteProductUseCase = new DeleteProductUseCase(productRepository)
    this.updateProductStatusUseCase = new UpdateProductStatusUseCase(productRepository)
  }

  static getInstance(httpClient: HttpClient, backendBaseUrl: string) {
    const nextSignature = `${backendBaseUrl}`
    if (!this.instance) {
      this.signature = nextSignature
      this.instance = new SellerContainer(httpClient, backendBaseUrl)
      return this.instance
    }
    if (this.signature !== nextSignature) {
      this.signature = nextSignature
      this.instance = new SellerContainer(httpClient, backendBaseUrl)
    }
    return this.instance
  }

  static resetForTests() {
    this.instance = null
    this.signature = null
  }
}