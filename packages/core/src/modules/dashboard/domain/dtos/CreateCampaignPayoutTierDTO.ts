import type { CampaignTierMetric } from '../entities/CampaignPayoutTier'

export type CreateCampaignPayoutTierDTO = {
  metric: CampaignTierMetric
  fromValue: number
  toValue?: number | null
  payoutAmount: number
  currency?: string | null
}