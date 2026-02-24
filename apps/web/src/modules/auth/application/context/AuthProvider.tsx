import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from './AuthContext'
import { useNotification } from '@/shared/context/notification'
import { WebAuthContainer } from '@core/modules/auth/infrastructure/container/AuthContainer'
import { User } from '@core/modules/auth/domain/entities/User'
import { LoginDTO } from '@core/modules/auth/domain/dtos/LoginDTO'
import { RegisterDTO } from '@core/modules/auth/domain/dtos/RegisterDTO'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const n = useNotification()
  const container = useMemo(() => WebAuthContainer.get(), [])

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshMe = useCallback(async (): Promise<void> => {
    const token = await container.tokenStorage.getToken()
    if (!token) {
      setUser(null)
      return
    }
    const me = await container.meUseCase.execute()
    setUser(me)
  }, [container])

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        await refreshMe()
      } catch {
        await container.tokenStorage.removeToken()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [refreshMe, container])

  const login = useCallback(
    async (dto: LoginDTO) => {
      setIsLoading(true)
      try {
        const res = await container.loginUseCase.execute(dto)
        setUser(res.user)
        n.success('Welcome back.')
      } catch (e: any) {
        n.error(e?.message ?? 'Login failed.')
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [container, n],
  )

  const register = useCallback(
    async (dto: RegisterDTO) => {
      setIsLoading(true)
      try {
        const res = await container.registerUseCase.execute(dto)
        setUser(res.user)
        n.success('Account created.')
      } catch (e: any) {
        n.error(e?.message ?? 'Registration failed.')
        throw e
      } finally {
        setIsLoading(false)
      }
    },
    [container, n],
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await container.logoutUseCase.execute()
      setUser(null)
      n.info('You are logged out.')
    } finally {
      setIsLoading(false)
    }
  }, [container, n])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshMe,
    }),
    [user, isLoading, login, register, logout, refreshMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}