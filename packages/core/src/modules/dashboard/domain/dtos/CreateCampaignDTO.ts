export type CreateCampaignDTO = {
  productId: string
  title: string
  objective?: string | null
  commissionType: 'percent' | 'fixed'
  commissionValue: number
  budget?: number | null
  startAt?: string | null
  endAt?: string | null
}