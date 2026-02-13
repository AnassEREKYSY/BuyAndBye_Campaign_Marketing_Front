import { RouteObject } from 'react-router-dom'
import { LoginPage, RegisterPage } from '@/modules/auth/presentation/pages'
import { HomePage } from '@/modules/home/presentation/pages/HomePage'
import { MainLayout } from './MainLayout'
import { AuthGuard } from './guards/AuthGuard'
import { ProfilePage } from '@/modules/users/presentation/pages/ProfilePage'
import { BecomeSellerPage } from '@/modules/users/presentation/pages/BecomeSellerPage'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <LoginPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <div>Forgot Password - Coming Soon</div>,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/home',
            element: <HomePage />,
          },
          {
            path: '/profile',
            element: <ProfilePage />,
          },
          {
            path: '/become-seller',
            element: <BecomeSellerPage />,
          },
        ],
      },
    ],
  },
]
