export type ApiCollaboration = {
  id: string
  campaign_id: string
  brand_id: string
  influencer_id: string
  accepted_at?: string | null
  status: string

  tracking?: {
    code?: string | null
    url?: string | null
    destination_url?: string | null
  }

  promo?: {
    code?: string | null
  }

  campaign?: {
    id: string
    title: string
    status: string
    commission_type?: string
    commission_value?: number
    budget?: number | null
    start_at?: string | null
    end_at?: string | null
    product?: { id: string; name: string; landing_url?: string | null } | null
  } | null

  brand?: { id: string; display_name: string; photo_url?: string | null } | null
  influencer?: { id: string; display_name: string; photo_url?: string | null } | null

  created_at?: string
  updated_at?: string
}