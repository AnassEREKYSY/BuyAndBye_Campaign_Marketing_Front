export type ApiInfluencerDashboard = {
  influencer: {
    id: string
    display_name: string
    photo_url?: string | null
  }
  totals: {
    clicks: number
    estimated_payout: number
    currency: string
    collaborations: number
  }
  collaborations: Array<{
    collaboration_id: string
    campaign: { id: string; title: string; status: string } | null
    brand: { id: string; display_name: string; photo_url?: string | null } | null
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