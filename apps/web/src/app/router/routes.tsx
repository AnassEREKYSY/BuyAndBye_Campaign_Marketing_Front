import { RouteObject } from 'react-router-dom'
import { LoginPage, RegisterPage } from '@/modules/auth/presentation/pages'
import { HomePage } from '@/modules/home/presentation/pages/HomePage'
import { MainLayout } from './MainLayout'
import { AuthGuard } from './guards/AuthGuard'
import { ProfilePage } from '@/modules/users/presentation/pages/ProfilePage'
import { BecomeSellerPage } from '@/modules/users/presentation/pages/BecomeSellerPage'
import { SellerDashboardPage } from '@/modules/seller/presentation/pages/SellerDashboardPage'
import { SellerRouteProviders } from '@/modules/seller/application/context/SellerRouteProviders'

export const routes: RouteObject[] = [
  { path: '/', element: <LoginPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <div>Forgot Password - Coming Soon</div> },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/home', element: <HomePage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/become-seller', element: <BecomeSellerPage /> },
        ],
      },
      {
        element: <AuthGuard requireSeller />,
        children: [
          {
            element: (
              <SellerRouteProviders>
                <MainLayout />
              </SellerRouteProviders>
            ),
            children: [{ path: '/seller/dashboard', element: <SellerDashboardPage /> }],
          },
        ],
      },
    ],
  },
]