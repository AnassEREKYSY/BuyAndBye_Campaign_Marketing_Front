import type { ReactNode } from 'react'
import { AuthProvider } from '@/modules/auth/application/context'
import { ProfileProvider } from '@/modules/profile/application/context'
import { NotificationProvider } from '@/shared/context/notification'
import { InboxNotificationsProvider } from '@/shared/context/inboxNotifications'

type Props = {
  children: ReactNode
}

export function UserProviders({ children }: Props) {
  return (
    <NotificationProvider>
      <AuthProvider>
        <InboxNotificationsProvider>
          <ProfileProvider>{children}</ProfileProvider>
        </InboxNotificationsProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}