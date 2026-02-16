import { CreateProductDTO } from "../dtos/CreateProductDTO"
import { UpdateProductDTO } from "../dtos/UpdateProductDTO"
import { Product } from "../entities/Product"

export interface PaginatedProducts {
  items: Product[]
  page: number
  pageSize: number
  total: number
}

export interface IProductRepository {
  getSellerProducts(page?: number, pageSize?: number): Promise<PaginatedProducts>
  createProduct(payload: CreateProductDTO): Promise<Product>
  updateProduct(payload: UpdateProductDTO): Promise<Product>
  deleteProduct(id: string): Promise<void>
  updateStatus(productId: string, status: string): Promise<void>
}