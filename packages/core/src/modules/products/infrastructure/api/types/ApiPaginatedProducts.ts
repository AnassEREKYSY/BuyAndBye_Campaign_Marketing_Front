import { Product } from '@/modules/products/domain/entities'

export interface ApiPaginatedProducts {
  data: Product[]
  links: any
  meta: {
    current_page: number
    per_page: number
    total: number
  }
}