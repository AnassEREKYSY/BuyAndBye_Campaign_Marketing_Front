import { createContext } from 'react'
import type { CurrentUserProfile } from '@core/modules/profile'

type ProfileState = {
  profile: CurrentUserProfile | null
  isLoading: boolean
  error: string | null

  refresh: () => Promise<void>

  updateBrand: (payload: {
    brand_name?: string
    website_url?: string
    industry?: string
    contact_email?: string
    contact_phone?: string
    description?: string
    logo?: File | null
  }) => Promise<void>

  updateInfluencer: (payload: {
    photo?: File | null
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
  }) => Promise<void>
}

export const ProfileContext = createContext<ProfileState | null>(null)