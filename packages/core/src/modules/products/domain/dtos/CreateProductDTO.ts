export type ProductCondition = 'New' | 'LikeNew' | 'VeryGood' | 'Good' | 'Acceptable' 

export interface CreateProductDTO {
  title: string
  description?: string | null
  categoryId?: string | null
  condition: ProductCondition
  price: number
  stockQuantity: number
  images?: File[]
  tags?: string[]
  weightKg?: number | null
  sku?: string | null
  isDigital: boolean
  allowReturns: boolean
  returnDays: number
}