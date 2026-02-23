import { Navigate } from 'react-router-dom'
import { MainLayout } from './MainLayout'
import { HomePage } from '@/modules/home/presentation/pages/HomePage'
import { LoginPage } from '@/modules/auth/presentation/pages/LoginPage'
import { RegisterPage } from '@/modules/auth/presentation/pages/RegisterPage'
import { BrandPage, ContactPage, InfluencerPage } from '@/modules/home/presentation/pages'
import { ProfilePage } from '@/modules/profile/presentation/pages/ProfilePage'

export const routes = [
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/brand', element: <BrandPage /> },
      { path: '/influencer', element: <InfluencerPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]