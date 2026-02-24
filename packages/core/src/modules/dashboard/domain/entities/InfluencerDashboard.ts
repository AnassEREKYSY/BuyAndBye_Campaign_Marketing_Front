export type InfluencerDashboard = {
  influencer: {
    id: string
    displayName: string
    photoUrl?: string | null
  }
  totals: {
    clicks: number
    estimatedPayout: number
    currency: string
    collaborations: number
  }
  collaborations: Array<{
    collaborationId: string
    campaign: { id: string; title: string; status: string } | null
    brand: { id: string; displayName: string; photoUrl?: string | null } | null
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