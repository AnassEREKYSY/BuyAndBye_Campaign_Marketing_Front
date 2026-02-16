import { RouteObject } from 'react-router-dom'
import { LoginPage, RegisterPage } from '@/modules/auth/presentation/pages'
import { HomePage } from '@/modules/home/presentation/pages/HomePage'
import { MainLayout } from './MainLayout'
import { AuthGuard } from './guards/AuthGuard'
import { ProfilePage } from '@/modules/users/presentation/pages/ProfilePage'
import { BecomeSellerPage } from '@/modules/users/presentation/pages/BecomeSellerPage'
import { SellerDashboardPage } from '@/modules/seller/presentation/pages/SellerDashboardPage'
import { SellerProvider } from '@/modules/seller/application/context/SellerProvider'
import { SellerContainer } from '@core/modules/seller/infrastructure/container/SellerContainer'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { TokenStorage } from '@/shared/services/storage/TokenStorage'
import { env } from '@/shared/config/env'

const tokenStorage = new TokenStorage()
const httpClient = new HttpClient(env.API_BASE_URL, tokenStorage)
const sellerContainer = SellerContainer.getInstance(httpClient, env.BACKEND_BASE_URL)

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
              <SellerProvider
                getSellerProductsUseCase={sellerContainer.getSellerProductsUseCase}
                createProductUseCase={sellerContainer.createProductUseCase}
                updateProductUseCase={sellerContainer.updateProductUseCase}
                deleteProductUseCase={sellerContainer.deleteProductUseCase}
                updateProductStatusUseCase={sellerContainer.updateProductStatusUseCase}
              >
                <MainLayout />
              </SellerProvider>
            ),
            children: [
              {
                path: '/seller/dashboard',
                element: <SellerDashboardPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]