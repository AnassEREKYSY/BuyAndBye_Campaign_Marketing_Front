import type { ApiInfluencerPublicProfile } from '../api/types/ApiInfluencerPublicProfile'
import type { InfluencerPublicProfile } from '../../domain/entities/InfluencerPublicProfile'

export class InfluencerPublicProfileMapper {
  static toDomain(api: ApiInfluencerPublicProfile): InfluencerPublicProfile {
    return {
      id: api.id,
      displayName: api.display_name,
      photoUrl: api.photo_url ?? null,

      niche: api.niche ?? null,
      countryCode: api.country_code ?? null,
      language: api.language ?? null,

      instagramUrl: api.instagram_url ?? null,
      tiktokUrl: api.tiktok_url ?? null,
      youtubeUrl: api.youtube_url ?? null,
      mediaKitUrl: api.media_kit_url ?? null,

      followersInstagram: api.followers_instagram ?? null,
      followersTiktok: api.followers_tiktok ?? null,
      followersYoutube: api.followers_youtube ?? null,
      avgEngagementRate: api.avg_engagement_rate ?? null,

      createdAt: api.created_at ?? null,
      updatedAt: api.updated_at ?? null,
    }
  }
}