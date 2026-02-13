import { ITokenStorage } from '@buyandbye/core';

const TOKEN_KEY = 'auth_token';

export class TokenStorage implements ITokenStorage {
  async getToken(): Promise<string | null> {
    return localStorage.getItem(TOKEN_KEY);
  }

  async setToken(token: string): Promise<void> {
    localStorage.setItem(TOKEN_KEY, token);
  }

  async removeToken(): Promise<void> {
    localStorage.removeItem(TOKEN_KEY);
  }
}
