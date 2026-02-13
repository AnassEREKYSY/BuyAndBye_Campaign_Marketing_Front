import { IUserRepository } from '../../domain/repositories/IUserRepository'
import { UpdateUserProfileDTO } from '../../domain/dtos/UpdateUserProfileDTO'
import { UpdateSellerProfileDTO } from '../../domain/dtos/UpdateSellerProfileDTO'
import { BecomeSellerDTO } from '../../domain/dtos/BecomeSellerDTO'
import { UserApiClient } from '../api/UserApiClient'

export class UserRepository implements IUserRepository {
  constructor(private userApiClient: UserApiClient) {}

  async becomeSeller(payload: BecomeSellerDTO): Promise<void> {
    await this.userApiClient.becomeSeller(payload)
  }

  async updateUserProfile(data: UpdateUserProfileDTO): Promise<void> {
    await this.userApiClient.updateUserProfile(data)
  }

  async updateSellerProfile(data: UpdateSellerProfileDTO): Promise<void> {
    await this.userApiClient.updateSellerProfile(data)
  }
}
