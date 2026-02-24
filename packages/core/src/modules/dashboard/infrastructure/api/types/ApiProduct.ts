export type ApiProduct = {
  id: string
  brand_id: string
  name: string
  description: string | null
  price: number | null
  currency: string | null
  landing_url: string | null
  status: 'draft' | 'active' | 'archived'
  images: string[]
  created_at: string | null
  updated_at: string | null
}