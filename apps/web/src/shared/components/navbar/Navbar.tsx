import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/shared/context/theme'
import { UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ProfileApiClient } from '@core/modules/profile/infrastructure/api/ProfileApiClient'
import type { ApiUserProfileResponse } from '@core/modules/profile/infrastructure/api/types/ApiUserProfileResponse'
import { httpClient } from '@/shared/api/http'
import { env } from '@/shared/config/env'

type NavItem = { to: string; label: string }

const publicNavItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/brand', label: 'Brand' },
  { to: '/influencer', label: 'Influencer' },
  { to: '/contact', label: 'Contact' },
]

const authedNavItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/collaborations', label: 'Collaborations' },
]

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

const AVATAR_CACHE_KEY = 'bb_avatar_url'

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
  const auth = useAuth()
  const { mode, toggle } = useTheme()

  const isLoggedIn = auth.isAuthenticated
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'
  const navItems = useMemo(() => (isLoggedIn ? authedNavItems : publicNavItems), [isLoggedIn])

  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string>(() => localStorage.getItem(AVATAR_CACHE_KEY) ?? '')
  const fetchingRef = useRef(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isLoggedIn) {
      setProfileImageUrl('')
      try {
        localStorage.removeItem(AVATAR_CACHE_KEY)
      } catch {}
      return
    }
    if (fetchingRef.current) return

    let cancelled = false
    fetchingRef.current = true

    ;(async () => {
      try {
        const api = new ProfileApiClient(httpClient)
        const raw = await api.getMyProfile()
        const u = unwrap(raw)
        if (cancelled) return

        const logo = (u.brandProfile?.logo_url ?? u.brand_profile?.logo_url ?? '')?.trim() || ''
        const photo = (u.photo_url ?? '')?.trim() || ''
        const finalUrl = toAbsolute(logo || photo)

        setProfileImageUrl(finalUrl)
        try {
          localStorage.setItem(AVATAR_CACHE_KEY, finalUrl)
        } catch {}
      } catch {
        if (!cancelled) setProfileImageUrl('')
      } finally {
        fetchingRef.current = false
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

  return (
    <header className="sticky top-0 z-50">
      <div className="bb-nav">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Left */}
          <div className="flex items-center gap-3">
            <NavLink to={isLoggedIn ? '/dashboard' : '/'} className="flex items-center gap-2" aria-label="Buy & Bye">
              <span className="bb-logo-dot" />
              <span className="text-sm font-extrabold tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
                Buy & Bye
              </span>
            </NavLink>

            <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => cx('bb-nav-link', isActive && 'bb-nav-link-active')}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button type="button" onClick={toggle} className="bb-nav-btn" aria-label="Toggle theme">
              {mode === 'dark' ? <IconSun /> : <IconMoon />}
              <span className="hidden sm:inline">{mode === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            {isLoggedIn && (
              <button type="button" onClick={() => navigate('/profile')} className="bb-avatar" aria-label="Profile">
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserIcon className="h-5 w-5" style={{ color: 'rgb(var(--bb-text) / 0.85)' }} />
                )}
              </button>
            )}

            {isLoggedIn ? (
              <button type="button" onClick={onLogout} className="bb-nav-btn">
                Logout
              </button>
            ) : (
              <NavLink to={isAuthRoute ? '/' : '/login'} className={cx(isAuthRoute ? 'bb-nav-btn' : 'bb-nav-cta')}>
                {isAuthRoute ? 'Back' : 'Login'}
              </NavLink>
            )}

            <button
              type="button"
              className="bb-nav-btn md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
            >
              {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile panel */}
        <div className={cx('md:hidden', mobileOpen ? 'block' : 'hidden')}>
          <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
            <div className="bb-nav-panel">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) => cx('bb-nav-link block px-3 py-2', isActive && 'bb-nav-link-active')}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}