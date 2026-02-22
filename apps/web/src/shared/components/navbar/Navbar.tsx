import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/modules/auth/application/context'

type NavItem = { to: string; label: string }

const navItems: NavItem[] = [
  { to: '/', label: 'Home' },
  { to: '/brand', label: 'Brand' },
  { to: '/influencer', label: 'Influencer' },
  { to: '/contact', label: 'Contact Us' },
]

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

export function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register'

  const auth = useAuth()
  const isLoggedIn = auth.isAuthenticated

  const avatarUrl = auth.user?.avatarUrl?.trim()
  const initials =
    (auth.user?.displayName ?? auth.user?.email ?? 'U')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join('') || 'U'

  async function onLogout() {
    await auth.logout()
    navigate('/', { replace: true })
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05060a]/70 backdrop-blur">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-indigo-500/10 via-sky-400/8 to-cyan-400/10" />

      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <NavLink to="/" className="flex items-center gap-2 text-white" aria-label="Buy & Bye home">
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
            <div className="mr-1 inline-flex items-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="h-9 w-9 rounded-full border border-white/12 object-cover shadow-[0_10px_30px_rgba(0,0,0,0.45)]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-full border border-white/12 bg-white/5 text-xs font-extrabold text-white/85">
                  {initials}
                </div>
              )}
            </div>
          )}

          {isLoggedIn ? (
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-4 py-2 text-sm font-extrabold text-white/90 transition hover:-translate-y-0.5 hover:bg-white/7"
            >
              Logout
            </button>
          ) : (
            <NavLink
              to={isAuthRoute ? '/' : '/login'}
              className={cx(
                'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-extrabold transition hover:-translate-y-0.5',
                isAuthRoute
                  ? 'border border-white/12 bg-white/5 text-white/90 hover:bg-white/7'
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