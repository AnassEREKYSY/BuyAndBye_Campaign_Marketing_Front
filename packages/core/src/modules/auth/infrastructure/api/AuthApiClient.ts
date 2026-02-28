import { HttpClient } from '@core/shared/services/http/HttpClient'
import type { ApiAuthResponse } from './types/ApiAuthResponse'
import type { ApiLoginRequest } from './types/ApiLoginRequest'
import type { ApiRegisterRequest } from './types/ApiRegisterRequest'
import type { ApiUserResponse } from './types/ApiUserResponse'

function unwrapAuth(res: ApiAuthResponse) {
  return (res as any)?.data?.token ? (res as any).data : (res as any)
}

export class AuthApiClient {
  constructor(private readonly http: HttpClient) {}

  async login(data: ApiLoginRequest): Promise<{ token: string; expiresIn?: number | null }> {
    const res = await this.http.post<ApiAuthResponse>('/auth/login', data)
    const payload = unwrapAuth(res)
    return {
      token: payload.token,
      expiresIn: payload.expires_in ?? null,
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

    const payload = unwrapAuth(res)
    return {
      token: payload.token,
      expiresIn: payload.expires_in ?? null,
    }
  }

  async me(): Promise<ApiUserResponse> {
    return this.http.get<ApiUserResponse>('/auth/me')
  }
}

export default AuthApiClient