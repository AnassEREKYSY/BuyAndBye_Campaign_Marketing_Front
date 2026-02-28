import { HttpClient } from '@core/shared/services/http/HttpClient'
import type { ApiUserProfileResponse } from './types/ApiUserProfileResponse'

export class ProfileApiClient {
  constructor(private readonly http: HttpClient) {}

  async getMyProfile(): Promise<ApiUserProfileResponse> {
    return this.http.get<ApiUserProfileResponse>('/api/v1/users/profile')
  }

  async updateBrandProfile(formData: FormData): Promise<ApiUserProfileResponse> {
    return this.http.put<ApiUserProfileResponse>('/api/v1/users/profile/brand', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }

  async updateInfluencerProfile(formData: FormData): Promise<ApiUserProfileResponse> {
    return this.http.put<ApiUserProfileResponse>('/api/v1/users/profile/influencer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  }
}