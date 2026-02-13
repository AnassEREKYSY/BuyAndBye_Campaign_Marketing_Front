import { HttpClient } from '../../../../shared/services/http/HttpClient'
import { UserApiClient } from '../api/UserApiClient'
import { UserRepository } from '../repositories/UserRepository'
import { BecomeSellerUseCase } from '../../application/use-cases/BecomeSellerUseCase'
import { UpdateUserProfileUseCase } from '../../domain/use-cases/UpdateUserProfileUseCase'
import { UpdateSellerProfileUseCase } from '../../domain/use-cases/UpdateSellerProfileUseCase'

export class UserContainer {
  private static instance: UserContainer

  public readonly becomeSellerUseCase: BecomeSellerUseCase
  public readonly updateUserProfileUseCase: UpdateUserProfileUseCase
  public readonly updateSellerProfileUseCase: UpdateSellerProfileUseCase

  private constructor(httpClient: HttpClient) {
    const userApiClient = new UserApiClient(httpClient)
    const userRepository = new UserRepository(userApiClient)

    this.becomeSellerUseCase = new BecomeSellerUseCase(userRepository)
    this.updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository)
    this.updateSellerProfileUseCase = new UpdateSellerProfileUseCase(userRepository)
  }

  public static getInstance(httpClient: HttpClient): UserContainer {
    if (!UserContainer.instance) {
      UserContainer.instance = new UserContainer(httpClient)
    }
    return UserContainer.instance
  }
}
