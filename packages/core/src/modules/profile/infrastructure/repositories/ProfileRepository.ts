// packages/core/src/modules/profile/infrastructure/repositories/ProfileRepository.ts
import { IProfileRepository } from '../../domain/repositories/IProfileRepository'
import { ProfileApiClient } from '../api/ProfileApiClient'
import { UserProfileMapper } from '../mappers/UserProfileMapper'
import { UpdateBrandProfileDTO } from '../../domain/dtos/UpdateBrandProfileDTO'
import { UpdateInfluencerProfileDTO } from '../../domain/dtos/UpdateInfluencerProfileDTO'
import { CurrentUserProfile } from '../../domain/entities/CurrentUserProfile'
export class ProfileRepository implements IProfileRepository {
  constructor(private readonly api: ProfileApiClient) {}

  async getMyProfile(): Promise<CurrentUserProfile> {
    const res = await this.api.getMyProfile()
    return UserProfileMapper.toDomain(res)
  }

  async updateBrandProfile(dto: UpdateBrandProfileDTO): Promise<CurrentUserProfile> {
    const fd = new FormData()

    const appendIf = (k: string, v: unknown) => {
      if (v === undefined || v === null || v === '') return
      fd.append(k, String(v))
    }

    appendIf('brand_name', dto.brand_name)
    appendIf('website_url', dto.website_url)
    appendIf('industry', dto.industry)
    appendIf('contact_email', dto.contact_email)
    appendIf('contact_phone', dto.contact_phone)
    appendIf('description', dto.description)

    if (dto.logo) fd.append('logo', dto.logo)

    const res = await this.api.updateBrandProfile(fd)
    return UserProfileMapper.toDomain(res)
  }

  async updateInfluencerProfile(dto: UpdateInfluencerProfileDTO): Promise<CurrentUserProfile> {
    const fd = new FormData()

    const appendIf = (k: string, v: unknown) => {
      if (v === undefined || v === null || v === '') return
      fd.append(k, String(v))
    }

    appendIf('niche', dto.niche)
    appendIf('instagram_url', dto.instagram_url)
    appendIf('tiktok_url', dto.tiktok_url)
    appendIf('youtube_url', dto.youtube_url)
    appendIf('followers_instagram', dto.followers_instagram)
    appendIf('followers_tiktok', dto.followers_tiktok)
    appendIf('followers_youtube', dto.followers_youtube)
    appendIf('avg_engagement_rate', dto.avg_engagement_rate)
    appendIf('country_code', dto.country_code)
    appendIf('language', dto.language)
    appendIf('media_kit_url', dto.media_kit_url)

    if (dto.photo) fd.append('photo', dto.photo)

    const res = await this.api.updateInfluencerProfile(fd)
    return UserProfileMapper.toDomain(res)
  }
}