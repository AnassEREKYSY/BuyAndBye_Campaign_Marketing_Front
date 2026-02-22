import { IAuthRepository } from '../../domain/repositories/IAuthRepository'
import { RegisterDTO } from '../../domain/dtos/RegisterDTO'
import { LoginDTO } from '../../domain/dtos/LoginDTO'
import { AuthResponse } from '../../domain/dtos/AuthResponse'
import { User } from '../../domain/entities/User'
import { AuthApiClient } from '../api/AuthApiClient'
import { UserToDomainMapper } from '../mappers/UserToDomainMapper'
import { ITokenStorage } from './ITokenStorage'

export class AuthRepository implements IAuthRepository {
  constructor(
    private authApiClient: AuthApiClient,
    private tokenStorage: ITokenStorage,
    private backendBaseUrl: string,
  ) {}

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const apiData = {
      email: data.email,
      display_name: data.displayName,
      password: data.password,
      role: data.role === 'brand' || data.role === 'influencer' ? data.role : (data.role as any),
      photo: data.photo,
    }

    const apiResponse = await this.authApiClient.register(apiData)
    await this.tokenStorage.setToken(apiResponse.token)

    const apiUser = await this.authApiClient.me()
    const user = UserToDomainMapper.map(apiUser, this.backendBaseUrl)

    return {
      user,
      token: { token: apiResponse.token, expiresIn: apiResponse.expiresIn ?? null },
    }
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const apiResponse = await this.authApiClient.login(data)
    await this.tokenStorage.setToken(apiResponse.token)

    const apiUser = await this.authApiClient.me()
    const user = UserToDomainMapper.map(apiUser, this.backendBaseUrl)

    return {
      user,
      token: { token: apiResponse.token, expiresIn: apiResponse.expiresIn ?? null },
    }
  }

  async getAuthenticatedUser(): Promise<User> {
    const apiUser = await this.authApiClient.me()
    return UserToDomainMapper.map(apiUser, this.backendBaseUrl)
  }

  async logout(): Promise<void> {
    await this.tokenStorage.removeToken()
  }
}