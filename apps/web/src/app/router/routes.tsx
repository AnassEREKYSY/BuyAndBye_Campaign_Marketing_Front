import { Navigate } from 'react-router-dom'
import { MainLayout } from './MainLayout'
import { AuthGuard } from './guards'
import { LoginPage } from '@/modules/auth/presentation/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/presentation/pages/RegisterPage'
import { BrandPage, ContactPage, InfluencerPage } from '@/modules/home/presentation/pages'
import { ProfilePage } from '@/modules/profile/presentation/pages/ProfilePage'
import DashboardPage from '@/modules/dashboard/presentation/pages/DashboardPage'
import { CampaignDetailsPage, CampaignsPage } from '@/modules'
import BrandProductsPage from '@/modules/dashboard/presentation/pages/BrandProductsPage'
import BrandCampaignsManagementPage from '@/modules/dashboard/presentation/pages/BrandCampaignsManagementPage'
import InfluencerApplicationsPage from '@/modules/dashboard/presentation/pages/InfluencerApplicationsPage'
import CollaborationsPage from '@/modules/dashboard/presentation/pages/CollaborationsPage'
import CollaborationDetailsPage from '@/modules/dashboard/presentation/pages/CollaborationDetailsPage'
import { HomeRedirect } from './HomeRedirect'

export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomeRedirect /> },
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

          { path: '/applications', element: <InfluencerApplicationsPage /> },

          { path: '/collaborations', element: <CollaborationsPage /> },
          { path: '/collaborations/:id', element: <CollaborationDetailsPage /> },

          { path: '/dashboard/brand/products', element: <BrandProductsPage /> },
          { path: '/dashboard/brand/campaigns', element: <BrandCampaignsManagementPage /> },
          { path: '/profile', element: <ProfilePage /> },
          { path: '/app', element: <Navigate to="/dashboard" replace /> },
        ],
      },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]