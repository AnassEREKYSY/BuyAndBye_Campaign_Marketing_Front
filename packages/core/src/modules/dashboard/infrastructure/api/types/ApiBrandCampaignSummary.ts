export type ApiBrandCampaignSummary = {
  campaign: {
    id: string
    title: string
    status: string
    product_id?: string
  }
  totals: {
    clicks: number
    collaborations: number
  }
  tiers: Array<{
    id: string
    metric: string
    from_value: number
    to_value: number | null
    payout_amount: number
    currency?: string | null
  }>
  collaborations: Array<{
    collaboration_id: string
    influencer: { id: string; display_name: string; photo_url?: string | null } | null
    tracking: { code?: string | null; url?: string | null }
    promo: { code?: string | null }
    clicks: number
    tier:
      | null
      | {
          id: string
          from_value: number
          to_value: number | null
          payout_amount: number
          currency?: string | null
        }
    payout_amount: number
    currency: string
  }>
}