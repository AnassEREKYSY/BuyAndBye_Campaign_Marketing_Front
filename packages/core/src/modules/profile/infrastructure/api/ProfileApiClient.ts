import { HttpClient } from '@core/shared/services/http/HttpClient'
import { ApiUserProfileResponse } from './types/ApiUserProfileResponse'

export class ProfileApiClient {
  constructor(private readonly http: HttpClient) {}

  async getMyProfile(): Promise<ApiUserProfileResponse> {
    const res = await this.http.get<ApiUserProfileResponse>('/api/v1/users/profile')
    return (res as any).data ?? res
  }

  async updateBrandProfile(formData: FormData): Promise<ApiUserProfileResponse> {
    const res = await this.http.put<ApiUserProfileResponse>('/api/v1/users/profile/brand', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return (res as any).data ?? res
  }

  async updateInfluencerProfile(formData: FormData): Promise<ApiUserProfileResponse> {
    const res = await this.http.put<ApiUserProfileResponse>('/api/v1/users/profile/influencer', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return (res as any).data ?? res
  }
}