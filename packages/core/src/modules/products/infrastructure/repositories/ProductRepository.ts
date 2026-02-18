import { IProductRepository, PaginatedProducts } from '@core/modules/products/domain/repositories/IProductRepository'
import { Product } from '@core/modules/products/domain/entities/Product'
import { ProductStatus } from '@core/modules/products/domain/entities/ProductStatus'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CreateProductDTO } from '@core/modules/products/domain/dtos/CreateProductDTO'
import { ApiPaginatedProducts } from '../api/types/ApiPaginatedProducts'
import { UpdateProductDTO } from '@core/modules/products/domain/dtos/UpdateProductDTO'

export class ProductRepository implements IProductRepository {
  constructor(private httpClient: HttpClient, private backendBaseUrl: string) {}

  private toAbsoluteUrl(url: string): string {
    if (!url) return url
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url
    const base = this.backendBaseUrl?.replace(/\/$/, '')
    if (!base) return url
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`
  }

  private mapProduct(p: any): Product {
    return {
      ...p,
      images: Array.isArray(p.images) ? p.images.map((img: string) => this.toAbsoluteUrl(img)) : p.images,
    } as Product
  }

  async getSellerProducts(page = 1, pageSize = 20): Promise<PaginatedProducts> {
    const response = await this.httpClient.get<ApiPaginatedProducts>(`/products?page=${page}&pageSize=${pageSize}`)
    const api = response.data

    return {
      items: (api.data ?? []).map((p: any) => this.mapProduct(p)),
      page: api.meta.current_page,
      pageSize: api.meta.per_page,
      total: api.meta.total,
    }
  }

  async createProduct(payload: CreateProductDTO): Promise<Product> {
    const fd = new FormData()

    fd.append('title', payload.title)
    if (payload.description != null) fd.append('description', payload.description)
    if (payload.categoryId != null) fd.append('category_id', payload.categoryId)
    fd.append('condition', payload.condition)
    fd.append('price', String(payload.price))
    fd.append('stock_quantity', String(payload.stockQuantity))

    fd.append('is_digital', payload.isDigital ? '1' : '0')
    fd.append('allow_returns', payload.allowReturns ? '1' : '0')
    fd.append('return_days', String(payload.returnDays))

    if (payload.weightKg != null) fd.append('weight_kg', String(payload.weightKg))
    if (payload.sku != null) fd.append('sku', payload.sku)

    if (payload.tags?.length) {
      payload.tags.forEach((t) => fd.append('tags[]', t))
    }

    if (payload.images?.length) {
      payload.images.forEach((file) => fd.append('images[]', file))
    }

    const response = await this.httpClient.post<Product>('/products', fd)
    return this.mapProduct(response.data)
  }

  async updateProduct(payload: UpdateProductDTO): Promise<Product> {
    const fd = new FormData()

    if (payload.title !== undefined) fd.append('title', payload.title)
    if (payload.description !== undefined) fd.append('description', payload.description ?? '')
    if (payload.categoryId !== undefined) fd.append('category_id', payload.categoryId ?? '')
    if (payload.condition !== undefined) fd.append('condition', payload.condition)
    if (payload.price !== undefined) fd.append('price', String(payload.price))
    if (payload.stockQuantity !== undefined) fd.append('stock_quantity', String(payload.stockQuantity))
    if (payload.weightKg !== undefined) fd.append('weight_kg', String(payload.weightKg ?? ''))
    if (payload.sku !== undefined) fd.append('sku', payload.sku ?? '')
    if (payload.isDigital !== undefined) fd.append('is_digital', payload.isDigital ? '1' : '0')
    if (payload.allowReturns !== undefined) fd.append('allow_returns', payload.allowReturns ? '1' : '0')
    if (payload.returnDays !== undefined) fd.append('return_days', String(payload.returnDays))

    if (payload.tags) {
      payload.tags.forEach((t) => fd.append('tags[]', t))
    }

    if (payload.images?.length) {
      payload.images.forEach((file) => fd.append('images[]', file))
    }

    const response = await this.httpClient.put<Product>(`/products/${payload.id}`, fd)
    return this.mapProduct(response.data)
  }

  async deleteProduct(id: string): Promise<void> {
    await this.httpClient.delete(`/products/${id}`)
  }

  async updateStatus(productId: string, status: ProductStatus): Promise<void> {
    await this.httpClient.patch(`/products/${productId}/status`, { status })
  }
}