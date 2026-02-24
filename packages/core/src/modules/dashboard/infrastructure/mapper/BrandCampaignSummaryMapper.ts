import { BrandCampaignSummary } from '../../domain/entities/BrandCampaignSummary'
import type { ApiBrandCampaignSummary } from '../api/types/ApiBrandCampaignSummary'

export class BrandCampaignSummaryMapper {
  static toDomain(d: ApiBrandCampaignSummary): BrandCampaignSummary {
    return {
      campaign: {
        id: d.campaign.id,
        title: d.campaign.title,
        status: d.campaign.status,
        productId: d.campaign.product_id,
      },
      totals: { clicks: d.totals.clicks, collaborations: d.totals.collaborations },
      tiers: (d.tiers ?? []).map((t) => ({
        id: t.id,
        metric: t.metric,
        fromValue: t.from_value,
        toValue: t.to_value,
        payoutAmount: t.payout_amount,
        currency: t.currency ?? null,
      })),
      collaborations: (d.collaborations ?? []).map((c) => ({
        collaborationId: c.collaboration_id,
        influencer: c.influencer
          ? { id: c.influencer.id, displayName: c.influencer.display_name, photoUrl: c.influencer.photo_url ?? null }
          : null,
        tracking: { code: c.tracking?.code ?? null, url: c.tracking?.url ?? null },
        promo: { code: c.promo?.code ?? null },
        clicks: c.clicks,
        tier: c.tier
          ? {
              id: c.tier.id,
              fromValue: c.tier.from_value,
              toValue: c.tier.to_value,
              payoutAmount: c.tier.payout_amount,
              currency: c.tier.currency ?? null,
            }
          : null,
        payoutAmount: c.payout_amount,
        currency: c.currency,
      })),
    }
  }
}