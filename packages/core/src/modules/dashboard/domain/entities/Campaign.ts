export type CampaignStatus = 'draft' | 'published' | 'closed'

export type Campaign = {
  id: string
  brandId?: string
  productId?: string
  title: string
  objective?: string | null
  commissionType?: 'percent' | 'fixed'
  commissionValue?: number
  budget?: number | null
  startAt?: string | null
  endAt?: string | null
  status: CampaignStatus
  createdAt?: string
  updatedAt?: string
}