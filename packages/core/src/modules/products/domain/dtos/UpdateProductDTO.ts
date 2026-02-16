import { ProductCondition } from './CreateProductDTO'

export interface UpdateProductDTO {
  id: string
  title?: string
  description?: string | null
  categoryId?: string | null
  condition?: ProductCondition
  price?: number
  stockQuantity?: number
  images?: File[]
  tags?: string[]
  weightKg?: number | null
  sku?: string | null
  isDigital?: boolean
  allowReturns?: boolean
  returnDays?: number
}