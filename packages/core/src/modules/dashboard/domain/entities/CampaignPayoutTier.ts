export type CampaignTierMetric = 'clicks'

export class CampaignPayoutTier {
  constructor(
    public readonly id: string,
    public readonly campaignId: string,
    public readonly metric: CampaignTierMetric,
    public readonly fromValue: number,
    public readonly toValue: number | null,
    public readonly payoutAmount: number,
    public readonly currency: string | null,
    public readonly createdAt?: string | null,
    public readonly updatedAt?: string | null,
  ) {}
}