export type ApiCampaignPayoutTier = {
  id: string
  campaign_id: string
  metric: 'clicks'
  from_value: number
  to_value: number | null
  payout_amount: number
  currency: string | null
  created_at?: string | null
  updated_at?: string | null
}