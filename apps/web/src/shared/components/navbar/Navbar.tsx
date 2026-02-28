import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/shared/context/theme'
import {
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'
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

function IconPill({
  label,
  icon,
  onClick,
  to,
  kind = 'ghost',
  ariaLabel,
}: {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  to?: string
  kind?: 'ghost' | 'cta'
  ariaLabel?: string
}) {
  const className = kind === 'cta' ? 'bb-nav-cta h-10 px-3' : 'bb-nav-btn h-10 px-3'
  const content = (
    <span className="inline-flex items-center gap-2">
      <span
        className="grid h-8 w-8 place-items-center rounded-full border"
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
        }}
      >
        {icon}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </span>
  )

  if (to) {
    return (
      <NavLink to={to} className={className} aria-label={ariaLabel ?? label}>
        {content}
      </NavLink>
    )
  }

  return (
    <button type="button" onClick={onClick} className={className} aria-label={ariaLabel ?? label}>
      {content}
    </button>
  )
}

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth()
  const { mode, toggle } = useTheme()

  const isLoggedIn = auth.isAuthenticated
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string>(() => localStorage.getItem(AVATAR_CACHE_KEY) ?? '')
  const [role, setRole] = useState<'brand' | 'influencer' | null>(null)
  const fetchingRef = useRef(false)

  const navItems = useMemo(() => {
    if (!isLoggedIn) return publicNavItems
    if (role === 'brand') {
      return [
        ...authedNavItems,
        { to: '/dashboard/brand/products', label: 'Products' },
        { to: '/dashboard/brand/campaigns', label: 'My campaigns' },
      ]
    }
    return authedNavItems
  }, [isLoggedIn, role])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isLoggedIn) {
      setProfileImageUrl('')
      setRole(null)
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
        setRole(u.role ?? null)

        try {
          localStorage.setItem(AVATAR_CACHE_KEY, finalUrl)
        } catch {}
      } catch {
        if (!cancelled) {
          setProfileImageUrl('')
          setRole(null)
        }
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

          <div className="flex items-center gap-2">
            <button type="button" onClick={toggle} className="bb-icon-btn h-10 w-10" aria-label="Toggle theme">
              {mode === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </button>

            {isLoggedIn && (
              <button type="button" onClick={() => navigate('/profile')} className="bb-avatar" aria-label="Profile">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <UserIcon className="h-5 w-5" style={{ color: 'rgb(var(--bb-text) / 0.85)' }} />
                )}
              </button>
            )}

            {isLoggedIn ? (
              <IconPill
                label="Logout"
                ariaLabel="Logout"
                onClick={onLogout}
                icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
                kind="ghost"
              />
            ) : (
              <IconPill
                label={isAuthRoute ? 'Back' : 'Login'}
                ariaLabel={isAuthRoute ? 'Back' : 'Login'}
                to={isAuthRoute ? '/' : '/login'}
                icon={
                  isAuthRoute ? <ArrowLeftIcon className="h-5 w-5" /> : <ArrowRightOnRectangleIcon className="h-5 w-5" />
                }
                kind={isAuthRoute ? 'ghost' : 'cta'}
              />
            )}

            <button
              type="button"
              className="bb-icon-btn h-10 w-10 md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Open menu"
            >
              {mobileOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </div>

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