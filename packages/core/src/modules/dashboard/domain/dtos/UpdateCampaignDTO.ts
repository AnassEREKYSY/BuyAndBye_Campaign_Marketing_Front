export type UpdateCampaignDTO = {
  title?: string
  objective?: string | null
  commissionType?: 'percent' | 'fixed' | null
  commissionValue?: number | null
  budget?: number | null
  startAt?: string | null
  endAt?: string | null
  status?: 'draft' | 'published' | 'closed' | null
}