import { ApiResponse } from './types/ApiResponse';
import { ApiAuthResponse } from './types/ApiAuthResponse';
import { ApiUserResponse } from './types/ApiUserResponse';
import { ApiRegisterRequest } from './types/ApiRegisterRequest';
import { ApiLoginRequest } from './types/ApiLoginRequest';
import { HttpClient } from '../../../../shared/services/http/HttpClient';

export class AuthApiClient {
  constructor(private httpClient: HttpClient) {}

  async register(data: ApiRegisterRequest): Promise<ApiAuthResponse> {
    const formData = new FormData();
    formData.append('email', data.email);
    formData.append('display_name', data.display_name);
    formData.append('role', data.role);
    formData.append('password', data.password);

    // Only append photo if provided
    if (data.photo) {
      formData.append('photo', data.photo);
    }

    const response = await this.httpClient.post<ApiResponse<ApiAuthResponse>>(
      '/auth/register',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data.data;
  }

  async login(data: ApiLoginRequest): Promise<ApiAuthResponse> {
    const response = await this.httpClient.post<ApiResponse<ApiAuthResponse>>('/auth/login', data);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data;
  }

  async me(): Promise<ApiUserResponse> {
    const response = await this.httpClient.get<{ data: ApiUserResponse }>('/auth/me');
  
    if (!response.data || !response.data.data) {
      throw new Error('Failed to fetch user');
    }
  
    return response.data.data;
  }
}
