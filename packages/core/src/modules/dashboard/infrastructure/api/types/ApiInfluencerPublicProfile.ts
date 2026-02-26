export type ApiInfluencerPublicProfile = {
  id: string
  display_name: string
  photo_url: string | null

  niche: string | null
  country_code: string | null
  language: string | null

  instagram_url: string | null
  tiktok_url: string | null
  youtube_url: string | null
  media_kit_url: string | null

  followers_instagram: number | null
  followers_tiktok: number | null
  followers_youtube: number | null
  avg_engagement_rate: number | null

  created_at: string | null
  updated_at: string | null
}