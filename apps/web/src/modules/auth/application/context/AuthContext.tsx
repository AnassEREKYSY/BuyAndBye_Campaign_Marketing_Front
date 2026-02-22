import { createContext, useContext } from 'react'
import { User } from '@core/modules/auth/domain/entities/User'
import { LoginDTO } from '@core/modules/auth/domain/dtos/LoginDTO'
import { RegisterDTO } from '@core/modules/auth/domain/dtos/RegisterDTO'

export type AuthContextValue = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (dto: LoginDTO) => Promise<void>
  register: (dto: RegisterDTO) => Promise<void>
  logout: () => Promise<void>
  refreshMe: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}