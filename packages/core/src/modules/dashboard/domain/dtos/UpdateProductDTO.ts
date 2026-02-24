export type UpdateProductDTO = {
  name?: string
  description?: string | null
  price?: number | null
  currency?: string | null
  landingUrl?: string | null
  status?: 'draft' | 'active' | 'archived' | null
  images?: string[] | null
}