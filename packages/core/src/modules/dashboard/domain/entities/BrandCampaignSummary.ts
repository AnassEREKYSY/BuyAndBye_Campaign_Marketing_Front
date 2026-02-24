export type BrandCampaignSummary = {
  campaign: {
    id: string
    title: string
    status: string
    productId?: string
  }
  totals: {
    clicks: number
    collaborations: number
  }
  tiers: Array<{
    id: string
    metric: string
    fromValue: number
    toValue: number | null
    payoutAmount: number
    currency?: string | null
  }>
  collaborations: Array<{
    collaborationId: string
    influencer: { id: string; displayName: string; photoUrl?: string | null } | null
    tracking: { code?: string | null; url?: string | null }
    promo: { code?: string | null }
    clicks: number
    tier:
      | null
      | {
          id: string
          fromValue: number
          toValue: number | null
          payoutAmount: number
          currency?: string | null
        }
    payoutAmount: number
    currency: string
  }>
}