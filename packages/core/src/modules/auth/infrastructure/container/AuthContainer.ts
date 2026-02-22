import { GetCurrentUserUseCase, LoginUseCase, LogoutUseCase, RegisterUseCase } from '@core/modules/auth/application/use-cases'
import { AuthApiClient } from '@core/modules/auth/infrastructure/api/AuthApiClient'
import { AuthRepository } from '@core/modules/auth/infrastructure/repositories/AuthRepository'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { env } from '@/shared/config/env'
import { CoreTokenStorage } from '@/shared/services/storage/CoreTokenStorage'

export class WebAuthContainer {
  private static instance: WebAuthContainer

  readonly loginUseCase: LoginUseCase
  readonly registerUseCase: RegisterUseCase
  readonly logoutUseCase: LogoutUseCase
  readonly meUseCase: GetCurrentUserUseCase
  readonly tokenStorage: CoreTokenStorage

  private constructor() {
    this.tokenStorage = new CoreTokenStorage()
    const http = new HttpClient(env.API_V1_BASE_URL, this.tokenStorage)
    const api = new AuthApiClient(http)
    const repo = new AuthRepository(api, this.tokenStorage, env.BACKEND_BASE_URL)

    this.loginUseCase = new LoginUseCase(repo)
    this.registerUseCase = new RegisterUseCase(repo)
    this.logoutUseCase = new LogoutUseCase(repo)
    this.meUseCase = new GetCurrentUserUseCase(repo)
  }

  static get(): WebAuthContainer {
    if (!WebAuthContainer.instance) WebAuthContainer.instance = new WebAuthContainer()
    return WebAuthContainer.instance
  }
}