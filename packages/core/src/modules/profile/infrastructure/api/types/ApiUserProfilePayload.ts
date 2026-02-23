import { UserRole } from "@core/modules/auth/domain/entities"
import { ApiBrandProfile } from "./ApiBrandProfile"
import { ApiInfluencerProfile } from "./ApiInfluencerProfile"

export type ApiUserProfilePayload = {
  id: string
  email: string
  display_name: string
  role: UserRole
  photo_url?: string | null

  brandProfile?: ApiBrandProfile | null
  influencerProfile?: ApiInfluencerProfile | null

  brand_profile?: ApiBrandProfile | null
  influencer_profile?: ApiInfluencerProfile | null
}