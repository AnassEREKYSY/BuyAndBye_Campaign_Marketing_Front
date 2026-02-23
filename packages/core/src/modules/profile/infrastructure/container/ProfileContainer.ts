import { ProfileApiClient } from '../api/ProfileApiClient'
import { ProfileRepository } from '../repositories/ProfileRepository'
import { GetMyProfileUseCase, UpdateBrandProfileUseCase, UpdateInfluencerProfileUseCase } from '../../application/use-cases'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { CoreTokenStorage } from '@/shared/services/storage/CoreTokenStorage'
import { env } from '@/shared/config/env'

export class WebProfileContainer {
  private static instance: WebProfileContainer

  public getMyProfileUseCase: GetMyProfileUseCase
  public updateBrandProfileUseCase: UpdateBrandProfileUseCase
  public updateInfluencerProfileUseCase: UpdateInfluencerProfileUseCase

  private constructor() {
    const tokenStorage = new CoreTokenStorage()
    const http = new HttpClient(env.BACKEND_BASE_URL, tokenStorage)

    const api = new ProfileApiClient(http)
    const repo = new ProfileRepository(api)

    this.getMyProfileUseCase = new GetMyProfileUseCase(repo)
    this.updateBrandProfileUseCase = new UpdateBrandProfileUseCase(repo)
    this.updateInfluencerProfileUseCase = new UpdateInfluencerProfileUseCase(repo)
  }

  static get() {
    if (!WebProfileContainer.instance) WebProfileContainer.instance = new WebProfileContainer()
    return WebProfileContainer.instance
  }
}