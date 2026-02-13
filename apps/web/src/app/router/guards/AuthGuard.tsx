import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'

export function AuthGuard() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
