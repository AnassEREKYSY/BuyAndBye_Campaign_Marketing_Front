import type { ApiProduct } from './ApiProduct'

export type ApiCampaign = {
  id: string
  brand_id: string
  product_id: string
  title: string
  objective: string | null
  commission_type: 'percent' | 'fixed'
  commission_value: number
  budget: number | null
  start_at: string | null
  end_at: string | null
  status: 'draft' | 'published' | 'closed'
  applications_count?: number | null
  product?: ApiProduct | null
  created_at?: string | null
  updated_at?: string | null
}