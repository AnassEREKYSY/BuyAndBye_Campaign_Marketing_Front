import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'
import { UserRole } from '@buyandbye/core'

interface AuthGuardProps {
  requireAuth?: boolean
  requireSeller?: boolean
  requireGuest?: boolean
}

export function AuthGuard({
  requireAuth = true,
  requireSeller = false,
  requireGuest = false,
}: AuthGuardProps) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (requireGuest && user) {
    return <Navigate to="/home" replace />
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />
  }

  if (requireSeller && user?.role !== UserRole.SELLER) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}