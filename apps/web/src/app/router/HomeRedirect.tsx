import { Navigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'
import { HomePage } from '@/modules/home/presentation/pages/HomePage'

export function HomeRedirect() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) return null
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <HomePage />
}