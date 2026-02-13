import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from '@/shared/components/navbar'

export function MainLayout() {
  const location = useLocation()

  const hideNavbar =
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register')

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
    </>
  )
}
