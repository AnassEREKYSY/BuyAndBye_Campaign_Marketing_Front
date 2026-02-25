import type { CampaignTierMetric } from '../entities/CampaignPayoutTier'

export type UpdateCampaignPayoutTierDTO = {
  metric?: CampaignTierMetric
  fromValue?: number
  toValue?: number | null
  payoutAmount?: number
  currency?: string | null
}