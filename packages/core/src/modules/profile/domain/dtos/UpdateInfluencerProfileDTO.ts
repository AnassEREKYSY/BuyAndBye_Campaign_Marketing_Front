export interface UpdateInfluencerProfileDTO {
  niche?: string
  instagram_url?: string
  tiktok_url?: string
  youtube_url?: string
  followers_instagram?: number
  followers_tiktok?: number
  followers_youtube?: number
  avg_engagement_rate?: number
  country_code?: string
  language?: string
  media_kit_url?: string
  photo?: File | null
}