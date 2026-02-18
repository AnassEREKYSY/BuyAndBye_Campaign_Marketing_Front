import { ApiResponse } from './types/ApiResponse'
import { ApiAuthResponse } from './types/ApiAuthResponse'
import { ApiUserResponse } from './types/ApiUserResponse'
import { ApiRegisterRequest } from './types/ApiRegisterRequest'
import { ApiLoginRequest } from './types/ApiLoginRequest'
import { HttpClient } from '../../../../shared/services/http/HttpClient'

type Wrapped<T> = ApiResponse<T> 
type Plain<T> = { data: T; message?: string }
type AnyApi<T> = Wrapped<T> | Plain<T> | T

function unwrapApi<T>(payload: AnyApi<T>, fallbackMessage: string): T {
  if (payload && typeof payload === 'object' && 'success' in payload) {
    const p = payload as Wrapped<T>
    if (!p.success || !p.data) throw new Error(p.message || fallbackMessage)
    return p.data
  }
  if (payload && typeof payload === 'object' && 'data' in payload) {
    const p = payload as Plain<T>
    if (p.data == null) throw new Error(p.message || fallbackMessage)
    return p.data
  }
  if (payload == null) throw new Error(fallbackMessage)
  return payload as T
}

export class AuthApiClient {
  constructor(private httpClient: HttpClient) {}

  async register(data: ApiRegisterRequest): Promise<ApiAuthResponse> {
    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('display_name', data.display_name)
    formData.append('password', data.password)

    if (data.photo) {
      formData.append('photo', data.photo)
    }

    const response = await this.httpClient.post<AnyApi<ApiAuthResponse>>('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })

    return unwrapApi<ApiAuthResponse>(response.data, 'Registration failed')
  }

  async login(data: ApiLoginRequest): Promise<ApiAuthResponse> {
    const response = await this.httpClient.post<AnyApi<ApiAuthResponse>>('/auth/login', data)
    return unwrapApi<ApiAuthResponse>(response.data, 'Login failed')
  }

  async me(): Promise<ApiUserResponse> {
    const response = await this.httpClient.get<AnyApi<ApiUserResponse>>('/auth/me')
    return unwrapApi<ApiUserResponse>(response.data, 'Failed to fetch user')
  }
}