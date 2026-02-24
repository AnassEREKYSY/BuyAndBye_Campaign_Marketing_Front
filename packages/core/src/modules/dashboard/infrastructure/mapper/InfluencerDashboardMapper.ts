import { InfluencerDashboard } from '../../domain/entities/InfluencerDashboard'
import type { ApiInfluencerDashboard } from '../api/types/ApiInfluencerDashboard'

export class InfluencerDashboardMapper {
  static toDomain(d: ApiInfluencerDashboard): InfluencerDashboard {
    return {
      influencer: {
        id: d.influencer.id,
        displayName: d.influencer.display_name,
        photoUrl: d.influencer.photo_url ?? null,
      },
      totals: {
        clicks: d.totals.clicks,
        estimatedPayout: d.totals.estimated_payout,
        currency: d.totals.currency,
        collaborations: d.totals.collaborations,
      },
      collaborations: (d.collaborations ?? []).map((c) => ({
        collaborationId: c.collaboration_id,
        campaign: c.campaign ? { ...c.campaign } : null,
        brand: c.brand ? { id: c.brand.id, displayName: c.brand.display_name, photoUrl: c.brand.photo_url ?? null } : null,
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