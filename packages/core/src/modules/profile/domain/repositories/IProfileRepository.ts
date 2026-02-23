import { UpdateBrandProfileDTO } from '../dtos/UpdateBrandProfileDTO'
import { UpdateInfluencerProfileDTO } from '../dtos/UpdateInfluencerProfileDTO'
import { CurrentUserProfile } from '../entities/CurrentUserProfile'

export interface IProfileRepository {
  getMyProfile(): Promise<CurrentUserProfile>
  updateBrandProfile(dto: UpdateBrandProfileDTO): Promise<CurrentUserProfile>
  updateInfluencerProfile(dto: UpdateInfluencerProfileDTO): Promise<CurrentUserProfile>
}