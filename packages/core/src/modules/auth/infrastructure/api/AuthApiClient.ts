import { HttpClient } from '@core/shared/services/http/HttpClient';
import { ApiAuthResponse } from './types/ApiAuthResponse'
import { ApiLoginRequest } from './types/ApiLoginRequest'
import { ApiRegisterRequest } from './types/ApiRegisterRequest'
import { ApiUserResponse } from './types/ApiUserResponse'

export class AuthApiClient {
  constructor(private readonly http: HttpClient) {}

  async login(data: ApiLoginRequest): Promise<{ token: string; expiresIn?: number | null }> {
    const res = await this.http.post<ApiAuthResponse>('/auth/login', data)
    return {
      token: res.data.data.token,
      expiresIn: res.data.data.expires_in ?? null,
    }
  }

  async register(data: ApiRegisterRequest): Promise<{ token: string; expiresIn?: number | null }> {
    const form = new FormData()
    form.append('email', data.email)
    form.append('password', data.password)
    form.append('display_name', data.display_name)
    form.append('role', data.role)
    if (data.photo) form.append('photo', data.photo)

    const res = await this.http.post<ApiAuthResponse>('/auth/register', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return {
      token: res.data.data.token,
      expiresIn: res.data.data.expires_in ?? null,
    }
  }

  async me(): Promise<ApiUserResponse> {
    const res = await this.http.get<ApiUserResponse>('/auth/me')
    return res.data
  }
}