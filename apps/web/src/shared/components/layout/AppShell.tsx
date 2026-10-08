import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChartBarIcon,
  MegaphoneIcon,
  CubeIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  BanknotesIcon,
  QrCodeIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '@/modules/auth/application/context'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { useTheme } from '@/shared/context/theme'
import { useInboxNotifications } from '@/shared/context/inboxNotifications'
import { useUnreadMessagesCount } from '@/modules/messaging/application/hooks'
import { Logo } from '@/shared/components/brand/Logo'
import { Snackbar } from '@/shared/components/Snackbar'
import { env } from '@/shared/config/env'

type Item = { to: string; label: string; icon: typeof HomeIcon; badge?: 'messages' | 'notifications'; end?: boolean }

const brandNav: Item[] = [
  { to: '/dashboard', label: 'Overview', icon: HomeIcon, end: true },
  { to: '/analytics', label: 'Analytics', icon: ChartBarIcon },
  { to: '/dashboard/brand/campaigns', label: 'Campaigns', icon: MegaphoneIcon },
  { to: '/dashboard/brand/products', label: 'Products', icon: CubeIcon },
  { to: '/collaborations', label: 'Collaborations', icon: UserGroupIcon },
]

const influencerNav: Item[] = [
  { to: '/dashboard', label: 'Overview', icon: HomeIcon, end: true },
  { to: '/campaigns', label: 'Find campaigns', icon: MagnifyingGlassIcon },
  { to: '/applications', label: 'Applications', icon: DocumentTextIcon },
  { to: '/collaborations', label: 'Collaborations', icon: UserGroupIcon },
  { to: '/earnings', label: 'Earnings', icon: BanknotesIcon },
  { to: '/links', label: 'Links & QR codes', icon: QrCodeIcon },
]

const adminNav: Item[] = [
  { to: '/dashboard', label: 'Overview', icon: HomeIcon, end: true },
  { to: '/campaigns', label: 'Campaigns', icon: MegaphoneIcon },
  { to: '/collaborations', label: 'Collaborations', icon: UserGroupIcon },
]

const inboxNav: Item[] = [
  { to: '/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon, badge: 'messages' },
  { to: '/notifications', label: 'Notifications', icon: BellIcon, badge: 'notifications' },
]

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || '?'
  )
}

function absolute(url?: string | null) {
  const u = (url ?? '').trim()
  if (!u) return ''
  if (/^https?:\/\//.test(u)) return u
  return `${(env.BACKEND_BASE_URL ?? '').replace(/\/$/, '')}${u.startsWith('/') ? u : `/${u}`}`
}

function NavList({ items, counts }: { items: Item[]; counts: Record<string, number> }) {
  return (
    <ul className="grid gap-0.5">
      {items.map((it) => {
        const Icon = it.icon
        const count = it.badge ? counts[it.badge] ?? 0 : 0
        return (
          <li key={it.to}>
            <NavLink to={it.to} end={it.end} className={({ isActive }) => `bb-side-link ${isActive ? 'bb-side-link-active' : ''}`}>
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="flex-1 truncate">{it.label}</span>
              {count > 0 ? <span className="bb-count">{count > 99 ? '99+' : count}</span> : null}
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}

function NotificationsMenu() {
  const inbox = useInboxNotifications()
  const navigate = useNavigate()
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!inbox.isOpen) return
      if (ref.current && e.target instanceof Node && ref.current.contains(e.target)) return
      inbox.close()
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [inbox])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="bb-icon-btn relative h-9 w-9"
        aria-label="Notifications"
        onClick={() => {
          inbox.toggle()
          if (!inbox.isOpen) void inbox.refresh()
        }}
      >
        <BellIcon className="h-5 w-5" />
        {inbox.unreadCount > 0 ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-bb-accent" /> : null}
      </button>

      {inbox.isOpen ? (
        <div className="bb-popover bb-pop absolute right-0 z-50 mt-2 w-[340px] max-w-[calc(100vw-2rem)]">
          <div className="flex items-center justify-between border-b border-bb-border/10 px-4 py-3">
            <p className="text-sm font-semibold">Notifications</p>
            <button type="button" className="text-xs font-medium text-bb-primary-strong hover:underline" onClick={() => void inbox.markAllRead()}>
              Mark all read
            </button>
          </div>
          <div className="max-h-[340px] overflow-auto bb-soft-scroll">
            {inbox.isLoading ? (
              <p className="p-4 text-sm text-bb-muted">Loading…</p>
            ) : inbox.latest.length === 0 ? (
              <p className="p-4 text-sm text-bb-muted">You're all caught up.</p>
            ) : (
              <ul>
                {inbox.latest.slice(0, 6).map((n) => (
                  <li key={n.id} className="border-b border-bb-border/[0.06] last:border-0">
                    <button type="button" onClick={() => void inbox.markRead(n.id)} className="flex w-full gap-3 px-4 py-3 text-left hover:bg-bb-subtle">
                      <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.read_at ? 'bg-transparent' : 'bg-bb-accent'}`} />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">{n.title}</span>
                        {n.body ? <span className="mt-0.5 line-clamp-2 block text-xs text-bb-muted">{n.body}</span> : null}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            type="button"
            className="block w-full border-t border-bb-border/10 px-4 py-2.5 text-center text-sm font-medium text-bb-text hover:bg-bb-subtle"
            onClick={() => {
              inbox.close()
              navigate('/notifications')
            }}
          >
            View all
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function AppShell() {
  const auth = useAuth() as any
  const { profile } = useProfile() as any
  const { mode, toggle } = useTheme()
  const inbox = useInboxNotifications()
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const { unread: unreadMessages, refresh: refreshMessages } = useUnreadMessagesCount(Boolean(auth.isAuthenticated))

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (auth.isAuthenticated) void refreshMessages()
  }, [auth.isAuthenticated, refreshMessages])

  const role: string = profile?.role ?? auth.user?.role ?? ''
  const name: string = profile?.display_name ?? auth.user?.displayName ?? ''
  const avatar = absolute(profile?.brandProfile?.logo_url ?? profile?.photo_url)

  const main = useMemo(() => (role === 'brand' ? brandNav : role === 'influencer' ? influencerNav : adminNav), [role])
  const counts = { messages: unreadMessages, notifications: inbox.unreadCount }

  async function logout() {
    await auth.logout()
    navigate('/', { replace: true })
  }

  const sidebar = (
    <div className="bb-sidebar w-60">
      <div className="flex h-14 items-center px-4">
        <NavLink to="/dashboard" aria-label="Kickback home">
          <Logo />
        </NavLink>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Main">
        <NavList items={main} counts={counts} />
        <p className="mt-6 px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-bb-muted/80">Inbox</p>
        <NavList items={inboxNav} counts={counts} />
      </nav>

      <div className="border-t border-bb-border/10 p-3">
        <NavLink to="/profile" className={({ isActive }) => `bb-side-link ${isActive ? 'bb-side-link-active' : ''}`}>
          <span className="bb-avatar">
            {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" referrerPolicy="no-referrer" /> : initials(name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-bb-text">{name || 'Profile'}</span>
            <span className="block truncate text-xs capitalize text-bb-muted">{role || 'Account'}</span>
          </span>
        </NavLink>
        <div className="mt-1 flex gap-1">
          <button type="button" onClick={toggle} className="bb-side-link flex-1" aria-label="Toggle theme">
            {mode === 'dark' ? <SunIcon className="h-[18px] w-[18px]" /> : <MoonIcon className="h-[18px] w-[18px]" />}
            <span>{mode === 'dark' ? 'Light' : 'Dark'}</span>
          </button>
          <button type="button" onClick={() => void logout()} className="bb-side-link flex-1" aria-label="Log out">
            <ArrowRightOnRectangleIcon className="h-[18px] w-[18px]" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-bb-bg text-bb-text">
      <Snackbar />

      <aside className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="relative h-full w-60 bb-pop">{sidebar}</div>
        </div>
      ) : null}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-bb-border/10 bg-bb-bg/95 px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <button type="button" className="bb-icon-btn h-9 w-9 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Open menu">
              {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
            <span className="lg:hidden">
              <Logo size={24} />
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" className="bb-icon-btn relative h-9 w-9" aria-label="Messages" onClick={() => navigate('/messages')}>
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              {unreadMessages > 0 ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-bb-accent" /> : null}
            </button>
            <NotificationsMenu />
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
