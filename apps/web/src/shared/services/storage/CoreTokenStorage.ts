import type { ITokenStorage } from '@core/modules/auth/infrastructure/repositories/ITokenStorage'

const KEY = 'bb_token'

export class CoreTokenStorage implements ITokenStorage {
  async getToken(): Promise<string | null> {
    return localStorage.getItem(KEY)
  }

  async setToken(token: string): Promise<void> {
    localStorage.setItem(KEY, token)
  }

  async removeToken(): Promise<void> {
    localStorage.removeItem(KEY)
  }
}