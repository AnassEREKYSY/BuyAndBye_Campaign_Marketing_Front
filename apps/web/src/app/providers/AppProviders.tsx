import { ReactNode, useMemo } from 'react'
import { AuthProvider } from '@/modules/auth/application/context'
import { AuthContainer, UserContainer, HttpClient } from '@buyandbye/core'
import { TokenStorage } from '@/shared/services/storage/TokenStorage'
import { NotificationProvider } from '@/shared/context/notification'
import { env } from '@/shared/config/env'

const tokenStorage = new TokenStorage()
const httpClient = new HttpClient(env.API_BASE_URL, tokenStorage)

const authContainer = AuthContainer.getInstance(httpClient, tokenStorage, env.BACKEND_BASE_URL)
const userContainer = UserContainer.getInstance(httpClient)

export const useAppHttpClient = () => httpClient
export const useAppBackendBaseUrl = () => env.BACKEND_BASE_URL

interface AppProvidersProps {
  children: ReactNode
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const value = useMemo(() => {
    return {
      registerUseCase: authContainer.registerUseCase,
      loginUseCase: authContainer.loginUseCase,
      logoutUseCase: authContainer.logoutUseCase,
      getCurrentUserUseCase: authContainer.getCurrentUserUseCase,
      updateUserProfileUseCase: userContainer.updateUserProfileUseCase,
      updateSellerProfileUseCase: userContainer.updateSellerProfileUseCase,
      becomeSellerUseCase: userContainer.becomeSellerUseCase,
    }
  }, [])

  return (
    <NotificationProvider>
      <AuthProvider {...value}>{children}</AuthProvider>
    </NotificationProvider>
  )
}