import { Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { MainLayout } from './MainLayout'
import { AppShell } from '@/shared/components/layout/AppShell'
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

const AnalyticsPage = lazy(() => import('@/modules/analytics/presentation/pages/AnalyticsPage'))
const EarningsPage = lazy(() => import('@/modules/earnings/presentation/pages/EarningsPage'))
const LinksPage = lazy(() => import('@/modules/earnings/presentation/pages/LinksPage'))

const NotificationsPage = lazy(() => import('@/modules/notifications/presentation/pages/NotificationsPage'))

const MessagesPage = lazy(() => import('@/modules/messaging/presentation/pages/MessagesPage'))
const ConversationThreadPage = lazy(() => import('@/modules/messaging/presentation/pages/ConversationThreadPage'))

function PageLoader() {
  return (
    <div className="grid gap-4">
      <div className="bb-skeleton h-7 w-48" />
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="bb-skeleton h-24" />
        <div className="bb-skeleton h-24" />
        <div className="bb-skeleton h-24" />
      </div>
      <div className="bb-skeleton h-64" />
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
    ],
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: '/dashboard', element: <Lazy><DashboardPage /></Lazy> },
          { path: '/analytics', element: <Lazy><AnalyticsPage /></Lazy> },
          { path: '/campaigns', element: <Lazy><CampaignsPage /></Lazy> },
          { path: '/campaigns/:id', element: <Lazy><CampaignDetailsPage /></Lazy> },

          { path: '/applications', element: <Lazy><InfluencerApplicationsPage /></Lazy> },
          { path: '/earnings', element: <Lazy><EarningsPage /></Lazy> },
          { path: '/links', element: <Lazy><LinksPage /></Lazy> },

          { path: '/collaborations', element: <Lazy><CollaborationsPage /></Lazy> },
          { path: '/collaborations/:id', element: <Lazy><CollaborationDetailsPage /></Lazy> },

          { path: '/dashboard/brand/products', element: <Lazy><BrandProductsPage /></Lazy> },
          { path: '/dashboard/brand/campaigns', element: <Lazy><BrandCampaignsManagementPage /></Lazy> },
          { path: '/profile', element: <ProfilePage /> },

          { path: '/notifications', element: <Lazy><NotificationsPage /></Lazy> },

          {
            path: '/messages',
            element: <Lazy><MessagesPage /></Lazy>,
            children: [{ path: ':id', element: <Lazy><ConversationThreadPage /></Lazy> }],
          },

          { path: '/app', element: <Navigate to="/dashboard" replace /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]
