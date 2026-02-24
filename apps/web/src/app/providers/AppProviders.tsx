import { RouterProvider } from 'react-router-dom'
import { appRouter } from '@/app/router/index.tsx'
import { NotificationProvider } from '@/shared/context/notification'
import { AuthProvider } from '@/modules/auth/application/context'
import { ProfileProvider } from '@/modules/profile/application/context'

export function AppProviders() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <ProfileProvider>
          <RouterProvider router={appRouter} />
        </ProfileProvider>
      </AuthProvider>
    </NotificationProvider>
  )
}