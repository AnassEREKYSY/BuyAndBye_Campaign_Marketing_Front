import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'

export function AuthGuard() {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}