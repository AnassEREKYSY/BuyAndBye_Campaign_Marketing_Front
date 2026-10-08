import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Snackbar } from '@/shared/components/Snackbar'
import { Logo, APP_NAME } from '@/shared/components/brand/Logo'
import { useTheme } from '@/shared/context/theme'
import { useAuth } from '@/modules/auth/application/context'

const links = [
  { to: '/brand', label: 'For brands' },
  { to: '/influencer', label: 'For creators' },
  { to: '/contact', label: 'Contact' },
]

/** Layout for public pages (landing, auth). The signed-in app uses AppShell. */
export function MainLayout() {
  const { mode, toggle } = useTheme()
  const auth = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-bb-bg text-bb-text">
      <Snackbar />
      <header className="bb-nav sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <NavLink to="/" aria-label={`${APP_NAME} home`}>
              <Logo />
            </NavLink>
            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {links.map((l) => (
                <NavLink key={l.to} to={l.to} className={({ isActive }) => `bb-nav-link ${isActive ? 'bb-nav-link-active' : ''}`}>
                  {l.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={toggle} className="bb-icon-btn h-9 w-9" aria-label="Toggle theme">
              {mode === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>
            {auth.isAuthenticated ? (
              <NavLink to="/dashboard" className="bb-btn-primary h-9">
                Open app
              </NavLink>
            ) : (
              <>
                <NavLink to="/login" className="bb-nav-link hidden sm:inline-flex">
                  Sign in
                </NavLink>
                <NavLink to="/register" className="bb-btn-primary h-9">
                  Get started
                </NavLink>
              </>
            )}
            <button type="button" className="bb-icon-btn h-9 w-9 md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open ? (
          <div className="border-t border-bb-border/10 px-4 py-2 md:hidden">
            {[...links, { to: '/login', label: 'Sign in' }].map((l) => (
              <NavLink key={l.to} to={l.to} className="bb-nav-link block">
                {l.label}
              </NavLink>
            ))}
          </div>
        ) : null}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-bb-border/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-3 px-4 py-8 text-sm text-bb-muted sm:flex-row sm:items-center sm:px-6">
          <Logo size={22} />
          <p>© {new Date().getFullYear()} {APP_NAME}. Influencer campaigns, measured.</p>
        </div>
      </footer>
    </div>
  )
}
