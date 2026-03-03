import { RouterProvider } from 'react-router-dom'
import { appRouter } from '@/app/router'
import { NotificationProvider } from '@/shared/context/notification'
import { AuthProvider } from '@/modules/auth/application/context'
import { ProfileProvider } from '@/modules/profile/application/context'
import { ThemeProvider } from '@/shared/context/theme'
import { InboxNotificationsProvider } from '@/shared/context/inboxNotifications'

export function AppProviders() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AuthProvider>
          <ProfileProvider>
            <InboxNotificationsProvider>
              <RouterProvider router={appRouter} />
            </InboxNotificationsProvider>
          </ProfileProvider>
        </AuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}