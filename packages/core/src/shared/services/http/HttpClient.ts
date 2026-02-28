import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { ITokenStorage } from '../../../modules/auth/infrastructure/repositories/ITokenStorage'

export class HttpClient {
  private client: AxiosInstance

  constructor(baseURL: string, private tokenStorage: ITokenStorage) {
    this.client = axios.create({
      baseURL,
      headers: { Accept: 'application/json' },
    })
    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      async (config) => {
        const token = await this.tokenStorage.getToken()
        if (token) {
          config.headers = config.headers ?? {}
          ;(config.headers as any).Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.get<T>(url, config)
    return res.data
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.post<T>(url, data, config)
    return res.data
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.put<T>(url, data, config)
    return res.data
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.patch<T>(url, data, config)
    return res.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const res = await this.client.delete<T>(url, config)
    return res.data
  }
}