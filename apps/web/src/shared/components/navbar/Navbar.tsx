import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'
import { UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'
import { env } from '@/shared/config/env'
import { CoreTokenStorage } from '@/shared/services/storage/CoreTokenStorage'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { ProfileApiClient } from '@core/modules/profile/infrastructure/api/ProfileApiClient'
import type { ApiUserProfileResponse } from '@core/modules/profile/infrastructure/api/types/ApiUserProfileResponse'
import { useTheme } from '@/shared/context/theme'

type NavItem = { to: string; label: string }

const publicNavItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/brand', label: 'Brand' },
  { to: '/influencer', label: 'Influencer' },
  { to: '/contact', label: 'Contact Us' },
]

const authedNavItems: NavItem[] = [{ to: '/dashboard', label: 'Dashboard' }]

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

type BrandProfile = { logo_url?: string | null }
type InfluencerProfile = { avatar_url?: string | null }
type Payload = {
  id: string
  role: 'brand' | 'influencer'
  photo_url?: string | null
  brandProfile?: BrandProfile | null
  brand_profile?: BrandProfile | null
  influencerProfile?: InfluencerProfile | null
  influencer_profile?: InfluencerProfile | null
}
function unwrap(res: ApiUserProfileResponse): Payload {
  return (res as any)?.data?.id ? ((res as any).data as Payload) : (res as any)
}

function toAbsolute(url: string) {
  const u = (url ?? '').trim()
  if (!u) return ''
  if (u.startsWith('http://') || u.startsWith('https://')) return u
  const base = env.BACKEND_BASE_URL.replace(/\/$/, '')
  const path = u.startsWith('/') ? u : `/${u}`
  return `${base}${path}`
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" stroke="currentColor" strokeWidth="2" />
      <path d="M12 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 20v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 12h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19.78 4.22 18.36 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5.64 18.36 4.22 19.78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M19.78 19.78 18.36 18.36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M5.64 5.64 4.22 4.22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M21 13.2A8.4 8.4 0 0 1 10.8 3 7.5 7.5 0 1 0 21 13.2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  const auth = useAuth()
  const isLoggedIn = auth.isAuthenticated

  const navItems = isLoggedIn ? authedNavItems : publicNavItems

  const [profileImageUrl, setProfileImageUrl] = useState<string>('')

  const { mode, toggle } = useTheme()

  useEffect(() => {
    if (!isLoggedIn) {
      setProfileImageUrl('')
      return
    }

    let cancelled = false

    ;(async () => {
      try {
        const tokenStorage = new CoreTokenStorage()
        const http = new HttpClient(env.BACKEND_BASE_URL, tokenStorage)
        const api = new ProfileApiClient(http)

        const raw = await api.getMyProfile()
        const u = unwrap(raw)

        if (cancelled) return

        const logo = (u.brandProfile?.logo_url ?? u.brand_profile?.logo_url ?? '')?.trim() || ''
        const photo = (u.photo_url ?? '')?.trim() || ''

        const finalUrl = toAbsolute(logo || photo)
        setProfileImageUrl(finalUrl)
      } catch {
        if (cancelled) return
        setProfileImageUrl('')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isLoggedIn])

  async function onLogout() {
    await auth.logout()
    navigate('/', { replace: true })
  }

  function goToProfile() {
    navigate('/profile')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/70 text-slate-900 backdrop-blur dark:border-white/10 dark:bg-[#05060a]/70 dark:text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-16 bg-gradient-to-r from-indigo-500/10 via-sky-400/8 to-cyan-400/10" />

      <div className="relative z-10 mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <NavLink
            to={isLoggedIn ? '/dashboard' : '/'}
            className="flex items-center gap-2"
            aria-label="Buy & Bye home"
          >
            <span className="h-9 w-9 rounded-2xl border border-black/10 bg-gradient-to-br from-indigo-500/80 to-sky-400/70 shadow-[0_14px_40px_rgba(56,189,248,0.12)] bb-gradient-shift dark:border-white/10" />
            <span className="text-sm font-extrabold tracking-tight text-slate-900/95 dark:text-white/95">Buy & Bye</span>
          </NavLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cx(
                    'rounded-full px-3 py-2 text-sm font-semibold transition',
                    'text-slate-700 hover:bg-black/5 hover:text-slate-900 dark:text-white/70 dark:hover:bg-white/5 dark:hover:text-white',
                    isActive && 'bg-black/8 text-slate-900 dark:bg-white/8 dark:text-white',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isLoggedIn && (
            <button
              type="button"
              onClick={goToProfile}
              className="mr-1 grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-black/10 bg-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.20)] transition hover:-translate-y-0.5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_10px_30px_rgba(0,0,0,0.45)] dark:hover:bg-white/10"
              aria-label="Open profile"
              title="Profile"
            >
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="h-5 w-5 text-slate-900/85 dark:text-white/85" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 text-sm font-extrabold text-slate-900/90 transition hover:-translate-y-0.5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
            aria-label="Toggle theme"
            title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {mode === 'dark' ? <IconSun /> : <IconMoon />}
            <span className="hidden sm:inline">{mode === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/5 px-4 py-2 text-sm font-extrabold text-slate-900/90 transition hover:-translate-y-0.5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to={isAuthRoute ? '/' : '/login'}
              className={cx(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-extrabold transition hover:-translate-y-0.5',
                isAuthRoute
                  ? 'border border-black/10 bg-black/5 text-slate-900/90 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10'
                  : 'bb-gradient-shift bg-gradient-to-r from-indigo-500/95 via-sky-400/85 to-cyan-400/85 text-white shadow-[0_16px_45px_rgba(56,189,248,0.14)]',
              )}
            >
              {isAuthRoute ? 'Back to Home' : 'Login'}
            </NavLink>
          )}
        </div>
      </div>
    </header>
  )
}