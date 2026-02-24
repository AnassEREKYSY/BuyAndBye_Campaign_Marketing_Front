import type { ReactNode } from 'react'
import { AuthProvider } from '@/modules/auth/application/context'
import { ProfileProvider } from '@/modules/profile/application/context'
import { NotificationProvider } from '@/shared/context/notification'

type Props = {
  children: ReactNode
}

export function UserProviders({ children }: Props) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ProfileProvider>{children}</ProfileProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}