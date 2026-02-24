import { Collaboration } from '../../domain/entities/Collaboration'
import type { ApiCollaboration } from '../api/types/ApiCollaboration'

export class CollaborationMapper {
  static toDomain(c: ApiCollaboration): Collaboration {
    return {
      id: c.id,
      campaignId: c.campaign_id,
      brandId: c.brand_id,
      influencerId: c.influencer_id,
      acceptedAt: c.accepted_at ?? null,
      status: c.status,
      tracking: c.tracking
        ? {
            code: c.tracking.code ?? null,
            url: c.tracking.url ?? null,
            destinationUrl: c.tracking.destination_url ?? null,
          }
        : undefined,
      promo: c.promo ? { code: c.promo.code ?? null } : undefined,
      campaign: c.campaign
        ? {
            id: c.campaign.id,
            title: c.campaign.title,
            status: c.campaign.status,
            commissionType: c.campaign.commission_type,
            commissionValue: c.campaign.commission_value,
            budget: c.campaign.budget ?? null,
            startAt: c.campaign.start_at ?? null,
            endAt: c.campaign.end_at ?? null,
            product: c.campaign.product
              ? {
                  id: c.campaign.product.id,
                  name: c.campaign.product.name,
                  landingUrl: c.campaign.product.landing_url ?? null,
                }
              : null,
          }
        : null,
      brand: c.brand ? { id: c.brand.id, displayName: c.brand.display_name, photoUrl: c.brand.photo_url ?? null } : null,
      influencer: c.influencer
        ? { id: c.influencer.id, displayName: c.influencer.display_name, photoUrl: c.influencer.photo_url ?? null }
        : null,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
    }
  }

  static toDomainList(items: ApiCollaboration[]): Collaboration[] {
    return (items ?? []).map((x) => this.toDomain(x))
  }
}