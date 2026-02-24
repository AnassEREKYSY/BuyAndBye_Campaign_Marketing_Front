import { Navigate } from 'react-router-dom'
import { MainLayout } from './MainLayout'
import { AuthGuard } from './guards'
import { HomePage } from '@/modules/home/presentation/pages/HomePage'
import { LoginPage } from '@/modules/auth/presentation/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/presentation/pages/RegisterPage'
import { BrandPage, ContactPage, InfluencerPage } from '@/modules/home/presentation/pages'
import { ProfilePage } from '@/modules/profile/presentation/pages/ProfilePage'
import DashboardPage from '@/modules/dashboard/presentation/pages/DashboardPage'
import { CampaignDetailsPage, CampaignsPage } from '@/modules'

export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/brand', element: <BrandPage /> },
      { path: '/influencer', element: <InfluencerPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },

      {
        element: <AuthGuard />,
        children: [
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/campaigns', element: <CampaignsPage /> },
          { path: '/campaigns/:id', element: <CampaignDetailsPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/app', element: <Navigate to="/dashboard" replace /> },
        ],
      },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]