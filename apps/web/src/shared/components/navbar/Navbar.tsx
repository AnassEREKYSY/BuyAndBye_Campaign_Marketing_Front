import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'
import { UserIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useState } from 'react'
import { env } from '@/shared/config/env'
import { CoreTokenStorage } from '@/shared/services/storage/CoreTokenStorage'
import { HttpClient } from '@core/shared/services/http/HttpClient'
import { ProfileApiClient } from '@core/modules/profile/infrastructure/api/ProfileApiClient'
import type { ApiUserProfileResponse } from '@core/modules/profile/infrastructure/api/types/ApiUserProfileResponse'

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

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  const auth = useAuth()
  const isLoggedIn = auth.isAuthenticated

  const navItems = isLoggedIn ? authedNavItems : publicNavItems

  const [profileImageUrl, setProfileImageUrl] = useState<string>('')

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/70 backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-indigo-500/10 via-sky-400/8 to-cyan-400/10" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <NavLink
            to={isLoggedIn ? '/dashboard' : '/'}
            className="flex items-center gap-2 text-white"
            aria-label="Buy & Bye home"
          >
            <span className="h-9 w-9 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/80 to-sky-400/70 shadow-[0_14px_40px_rgba(56,189,248,0.12)] bb-gradient-shift" />
            <span className="text-sm font-extrabold tracking-tight text-white/95">Buy & Bye</span>
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
                    'text-white/70 hover:bg-white/5 hover:text-white',
                    isActive && 'bg-white/8 text-white',
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
              className="mr-1 grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-white/10 bg-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:-translate-y-0.5 hover:bg-white/10"
              aria-label="Open profile"
              title="Profile"
            >
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="Profile" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="h-5 w-5 text-white/85" />
              )}
            </button>
          )}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-extrabold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/10"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to={isAuthRoute ? '/' : '/login'}
              className={cx(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-extrabold transition hover:-translate-y-0.5',
                isAuthRoute
                  ? 'border border-white/10 bg-white/5 text-white/90 hover:bg-white/10'
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