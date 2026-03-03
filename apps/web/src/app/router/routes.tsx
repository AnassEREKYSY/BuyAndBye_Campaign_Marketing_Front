import { Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { MainLayout } from './MainLayout'
import { AuthGuard } from './guards'
import { HomeRedirect } from './HomeRedirect'

import { LoginPage } from '@/modules/auth/presentation/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/presentation/pages/RegisterPage'
import { BrandPage, ContactPage, InfluencerPage } from '@/modules/home/presentation/pages'
import { ProfilePage } from '@/modules/profile/presentation/pages/ProfilePage'

const DashboardPage = lazy(() => import('@/modules/dashboard/presentation/pages/DashboardPage'))
const CampaignsPage = lazy(() => import('@/modules').then((m) => ({ default: m.CampaignsPage })))
const CampaignDetailsPage = lazy(() => import('@/modules').then((m) => ({ default: m.CampaignDetailsPage })))

const BrandProductsPage = lazy(() => import('@/modules/dashboard/presentation/pages/BrandProductsPage'))
const BrandCampaignsManagementPage = lazy(() => import('@/modules/dashboard/presentation/pages/BrandCampaignsManagementPage'))
const InfluencerApplicationsPage = lazy(() => import('@/modules/dashboard/presentation/pages/InfluencerApplicationsPage'))
const CollaborationsPage = lazy(() => import('@/modules/dashboard/presentation/pages/CollaborationsPage'))
const CollaborationDetailsPage = lazy(() => import('@/modules/dashboard/presentation/pages/CollaborationDetailsPage'))

const NotificationsPage = lazy(() => import('@/modules/notifications/presentation/pages/NotificationsPage'))

function PageLoader() {
  return (
    <div className="bb-page">
      <div className="bb-surface bb-surface-pad">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />
        <div className="relative grid gap-4">
          <div className="h-6 w-44 rounded-full bg-white/10 dark:bg-white/10" />
          <div className="h-10 w-2/3 rounded-2xl bg-white/10 dark:bg-white/10" />
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="h-28 rounded-3xl bg-white/10" />
            <div className="h-28 rounded-3xl bg-white/10" />
            <div className="h-28 rounded-3xl bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  )
}

const Lazy = ({ children }: { children: React.ReactNode }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>

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
          { path: '/dashboard', element: <Lazy><DashboardPage /></Lazy> },
          { path: '/campaigns', element: <Lazy><CampaignsPage /></Lazy> },
          { path: '/campaigns/:id', element: <Lazy><CampaignDetailsPage /></Lazy> },

          { path: '/applications', element: <Lazy><InfluencerApplicationsPage /></Lazy> },

          { path: '/collaborations', element: <Lazy><CollaborationsPage /></Lazy> },
          { path: '/collaborations/:id', element: <Lazy><CollaborationDetailsPage /></Lazy> },

          { path: '/dashboard/brand/products', element: <Lazy><BrandProductsPage /></Lazy> },
          { path: '/dashboard/brand/campaigns', element: <Lazy><BrandCampaignsManagementPage /></Lazy> },
          { path: '/profile', element: <ProfilePage /> },

          { path: '/notifications', element: <Lazy><NotificationsPage /></Lazy> },

          { path: '/app', element: <Navigate to="/dashboard" replace /> },
        ],
      },

      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]