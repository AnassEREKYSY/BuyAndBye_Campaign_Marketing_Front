import { CurrentUserProfile } from '../../domain/entities/CurrentUserProfile'
import { ApiUserProfilePayload } from '../api/types/ApiUserProfilePayload'
import type { ApiUserProfileResponse, } from '../api/types/ApiUserProfileResponse'

function unwrap(res: ApiUserProfileResponse): ApiUserProfilePayload {
  return (res as any)?.data?.id ? ((res as any).data as ApiUserProfilePayload) : (res as any)
}

export class UserProfileMapper {
  static toDomain(api: ApiUserProfileResponse): CurrentUserProfile {
    const u = unwrap(api)

    const brand = (u.brandProfile ?? u.brand_profile ?? null) as any
    const influencer = (u.influencerProfile ?? u.influencer_profile ?? null) as any

    return {
      id: u.id,
      email: u.email,
      display_name: u.display_name,
      role: u.role,
      photo_url: u.photo_url ?? null,
      brandProfile: brand,
      influencerProfile: influencer,
    }
  }
}