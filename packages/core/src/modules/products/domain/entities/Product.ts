export interface Product {
    id: string
    sellerId: string
    title: string
    description?: string | null
    categoryId?: string | null
    condition?: string | null
    status: string
    price: number
    compareAtPrice?: number | null
    stockQuantity: number
    images?: string[] | null
    tags?: string[] | null
    weightKg?: number | null
    sku?: string | null
    isDigital: boolean
    allowReturns: boolean
    returnDays: number
    isFeatured: boolean
    publishedAt?: string | null
  }