export type InfluencerPublicProfile = {
  id: string
  displayName: string
  photoUrl: string | null

  niche: string | null
  countryCode: string | null
  language: string | null

  instagramUrl: string | null
  tiktokUrl: string | null
  youtubeUrl: string | null
  mediaKitUrl: string | null

  followersInstagram: number | null
  followersTiktok: number | null
  followersYoutube: number | null
  avgEngagementRate: number | null

  createdAt: string | null
  updatedAt: string | null
}