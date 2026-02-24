export type CreateProductDTO = {
  name: string
  description?: string | null
  price?: number | null
  currency?: string | null
  landingUrl?: string | null
  images?: string[] | null
}