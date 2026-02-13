import { ReactNode, useState, useEffect, useCallback } from 'react'
import { AuthContext, AuthContextValue } from './AuthContext'
import {
  User,
  RegisterDTO,
  LoginDTO,
  RegisterUseCase,
  LoginUseCase,
  LogoutUseCase,
  GetCurrentUserUseCase,
  UpdateUserProfileUseCase,
  UpdateSellerProfileUseCase,
  UpdateSellerProfileDTO,
  UpdateUserProfileDTO,
  BecomeSellerUseCase,
  BecomeSellerDTO,
} from '@buyandbye/core'

interface AuthProviderProps {
  children: ReactNode
  registerUseCase: RegisterUseCase
  loginUseCase: LoginUseCase
  logoutUseCase: LogoutUseCase
  getCurrentUserUseCase: GetCurrentUserUseCase
  updateUserProfileUseCase: UpdateUserProfileUseCase
  updateSellerProfileUseCase: UpdateSellerProfileUseCase
  becomeSellerUseCase: BecomeSellerUseCase
}

export const AuthProvider = ({
  children,
  registerUseCase,
  loginUseCase,
  logoutUseCase,
  getCurrentUserUseCase,
  updateUserProfileUseCase,
  updateSellerProfileUseCase,
  becomeSellerUseCase,
}: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const currentUser = await getCurrentUserUseCase.execute()
      setUser(currentUser)

    } catch (err) {
      setUser(null)
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
    } finally {
      setIsLoading(false)
    }
  }, [getCurrentUserUseCase])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const register = async (data: RegisterDTO): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const { user: newUser } = await registerUseCase.execute(data)
      setUser(newUser)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (data: LoginDTO): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      const { user: loggedInUser } = await loginUseCase.execute(data)
      setUser(loggedInUser)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      await logoutUseCase.execute()
      setUser(null)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateUserProfile = async (
    data: UpdateUserProfileDTO
  ): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      await updateUserProfileUseCase.execute(data)
      await refreshUser()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Profile update failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const updateSellerProfile = async (
    data: UpdateSellerProfileDTO
  ): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      await updateSellerProfileUseCase.execute(data)
      await refreshUser()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Seller update failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const becomeSeller = async (data: BecomeSellerDTO): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      await becomeSellerUseCase.execute(data)
      await refreshUser()

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Become seller failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextValue = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    register,
    login,
    logout,
    refreshUser,
    updateUserProfile,
    updateSellerProfile,
    becomeSeller,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
