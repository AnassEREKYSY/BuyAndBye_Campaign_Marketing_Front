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
  BellIcon,
  CheckIcon,
  TrashIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { ProfileApiClient } from '@core/modules/profile/infrastructure/api/ProfileApiClient'
import type { ApiUserProfileResponse } from '@core/modules/profile/infrastructure/api/types/ApiUserProfileResponse'
import { httpClient } from '@/shared/api/http'
import { env } from '@/shared/config/env'
import { useInboxNotifications } from '@/shared/context/inboxNotifications'
import { useUnreadMessagesCount } from '@/modules/messaging/application/hooks'

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
const USER_ID_CACHE_KEY = 'bb_user_id'
const USER_ROLE_CACHE_KEY = 'bb_user_role'

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

function formatDate(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString()
}

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useAuth()
  const { mode, toggle } = useTheme()
  const inbox = useInboxNotifications()

  const isLoggedIn = auth.isAuthenticated
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  const { unread: unreadMessages, refresh: refreshUnreadMessages } = useUnreadMessagesCount(isLoggedIn)

  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileImageUrl, setProfileImageUrl] = useState<string>(() => localStorage.getItem(AVATAR_CACHE_KEY) ?? '')
  const [role, setRole] = useState<'brand' | 'influencer' | null>(() => (localStorage.getItem(USER_ROLE_CACHE_KEY) as any) ?? null)
  const fetchingRef = useRef(false)

  const popoverRef = useRef<HTMLDivElement | null>(null)

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
    function onDocClick(e: MouseEvent) {
      if (!inbox.isOpen) return
      const el = popoverRef.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      inbox.close()
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [inbox])

  useEffect(() => {
    if (!isLoggedIn) {
      setProfileImageUrl('')
      setRole(null)
      try {
        localStorage.removeItem(AVATAR_CACHE_KEY)
        localStorage.removeItem(USER_ID_CACHE_KEY)
        localStorage.removeItem(USER_ROLE_CACHE_KEY)
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
          localStorage.setItem(USER_ID_CACHE_KEY, String(u.id))
          localStorage.setItem(USER_ROLE_CACHE_KEY, String(u.role ?? ''))
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

  useEffect(() => {
    if (!isLoggedIn) return
    void refreshUnreadMessages()
  }, [isLoggedIn, refreshUnreadMessages])

  async function onLogout() {
    await auth.logout()
    navigate('/', { replace: true })
  }

  const unread = inbox.unreadCount

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
              <button
                type="button"
                className="bb-icon-btn relative h-10 w-10"
                onClick={() => navigate('/messages')}
                aria-label="Messages"
              >
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                {unreadMessages > 0 ? (
                  <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-emerald-500 px-1 text-xs font-extrabold text-white">
                    {unreadMessages > 99 ? '99+' : unreadMessages}
                  </span>
                ) : null}
              </button>
            )}

            {isLoggedIn && (
              <div className="relative" ref={popoverRef}>
                <button
                  type="button"
                  className="bb-icon-btn relative h-10 w-10"
                  onClick={() => {
                    inbox.toggle()
                    if (!inbox.isOpen) void inbox.refresh()
                  }}
                  aria-label="Notifications"
                >
                  <BellIcon className="h-5 w-5" />
                  {unread > 0 ? (
                    <span className="absolute -right-1 -top-1 grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-rose-500 px-1 text-xs font-extrabold text-white">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  ) : null}
                </button>

                <div
                  className={cx(
                    'absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl border border-white/10 bg-[rgb(var(--bb-bg)/0.92)] shadow-2xl backdrop-blur',
                    inbox.isOpen ? 'block' : 'hidden',
                  )}
                >
                  <div className="flex items-center justify-between gap-2 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
                        Notifications
                      </p>
                      <p className="text-xs" style={{ color: 'rgb(var(--bb-text) / 0.60)' }}>
                        {unread} unread
                      </p>
                    </div>
                    <button type="button" onClick={() => void inbox.markAllRead()} className="bb-nav-btn h-9 px-3 text-xs">
                      Mark all read
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-auto">
                    {inbox.isLoading ? (
                      <div className="p-4 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.65)' }}>
                        Loading...
                      </div>
                    ) : inbox.latest.length === 0 ? (
                      <div className="p-4 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.65)' }}>
                        No notifications.
                      </div>
                    ) : (
                      <ul className="divide-y divide-white/10">
                        {inbox.latest.slice(0, 6).map((n) => {
                          const isUnread = !n.read_at
                          return (
                            <li key={n.id} className="p-3">
                              <div className="flex items-start justify-between gap-3">
                                <button type="button" onClick={() => void inbox.markRead(n.id)} className="min-w-0 text-left">
                                  <div className="flex items-start gap-2">
                                    <span className={cx('mt-1.5 h-2 w-2 rounded-full', isUnread ? 'bg-emerald-400' : 'bg-white/20')} />
                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                                        {n.title}
                                      </p>
                                      {n.body ? (
                                        <p className="mt-0.5 line-clamp-2 text-xs" style={{ color: 'rgb(var(--bb-text) / 0.70)' }}>
                                          {n.body}
                                        </p>
                                      ) : null}
                                      <p className="mt-1 text-[11px]" style={{ color: 'rgb(var(--bb-text) / 0.55)' }}>
                                        {formatDate(n.created_at)}
                                      </p>
                                    </div>
                                  </div>
                                </button>

                                <div className="flex items-center gap-1">
                                  <button type="button" onClick={() => void inbox.markRead(n.id)} className="bb-icon-btn h-9 w-9" aria-label="Mark read">
                                    <CheckIcon className="h-5 w-5" />
                                  </button>
                                  <button type="button" onClick={() => void inbox.remove(n.id)} className="bb-icon-btn h-9 w-9" aria-label="Delete">
                                    <TrashIcon className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 border-t border-white/10 p-3">
                    <button
                      type="button"
                      onClick={() => {
                        inbox.close()
                        navigate('/notifications')
                      }}
                      className="bb-nav-cta h-10 px-4 text-sm"
                    >
                      See all
                    </button>
                    <button type="button" onClick={() => inbox.close()} className="bb-nav-btn h-10 px-4 text-sm">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

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
              <IconPill label="Logout" ariaLabel="Logout" onClick={onLogout} icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />} kind="ghost" />
            ) : (
              <IconPill
                label={isAuthRoute ? 'Back' : 'Login'}
                ariaLabel={isAuthRoute ? 'Back' : 'Login'}
                to={isAuthRoute ? '/' : '/login'}
                icon={isAuthRoute ? <ArrowLeftIcon className="h-5 w-5" /> : <ArrowRightOnRectangleIcon className="h-5 w-5" />}
                kind={isAuthRoute ? 'ghost' : 'cta'}
              />
            )}

            <button type="button" className="bb-icon-btn h-10 w-10 md:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Open menu">
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

              {isLoggedIn ? (
                <>
                  <button type="button" onClick={() => navigate('/messages')} className="bb-nav-link block w-full px-3 py-2 text-left">
                    Messages {unreadMessages > 0 ? `(${unreadMessages})` : ''}
                  </button>
                  <button type="button" onClick={() => navigate('/notifications')} className="bb-nav-link block w-full px-3 py-2 text-left">
                    Notifications {unread > 0 ? `(${unread})` : ''}
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}