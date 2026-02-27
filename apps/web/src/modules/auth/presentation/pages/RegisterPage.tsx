import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuth } from '@/modules/auth/application/context'
import { UserRole } from '@core/modules/auth/domain/entities'

type Role = 'brand' | 'influencer'
const toUserRole = (role: Role) => (role === 'brand' ? UserRole.BRAND : UserRole.INFLUENCER)

export function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState<Role>('brand')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const roleLabel = useMemo(() => (role === 'brand' ? 'Brand' : 'Influencer'), [role])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await auth.register({ role: toUserRole(role), email, displayName: fullName, password })
    navigate('/dashboard', { replace: true })
  }

  const roleBtn = (active: boolean) =>
    active
      ? {
          borderColor: 'rgb(var(--bb-accent) / 0.35)',
          backgroundColor: 'rgb(var(--bb-border) / 0.04)',
          color: 'rgb(var(--bb-text) / 0.92)',
        }
      : {
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-card) / 0.70)',
          color: 'rgb(var(--bb-muted) / 0.90)',
        }

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-surface bb-surface-pad bb-pop">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <span className="bb-chip">Get started</span>
            <h1 className="bb-title mt-4">Create account</h1>
            <p className="bb-p mt-4 max-w-xl">
              Choose your profile: <span style={{ color: 'rgb(var(--bb-text) / 0.95)' }} className="font-extrabold">{roleLabel}</span>.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="bb-card p-4">
                <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  Clean onboarding
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  Fast signup and a premium first impression.
                </p>
              </div>

              <div className="bb-card p-4">
                <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  Role based
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  Brand and influencer experiences are tailored.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bb-card">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('brand')}
                  className="rounded-2xl border px-4 py-3 text-sm font-extrabold transition"
                  style={roleBtn(role === 'brand')}
                >
                  Brand
                </button>

                <button
                  type="button"
                  onClick={() => setRole('influencer')}
                  className="rounded-2xl border px-4 py-3 text-sm font-extrabold transition"
                  style={roleBtn(role === 'influencer')}
                >
                  Influencer
                </button>
              </div>

              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  Full name
                  <input
                    className="bb-input"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    type="text"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  Email
                  <input
                    className="bb-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  Password
                  <input
                    className="bb-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <button disabled={auth.isLoading} className="bb-btn-primary mt-2" type="submit">
                  {auth.isLoading ? 'Creating…' : 'Create account'}
                </button>

                <p className="mt-2 text-sm" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-extrabold underline underline-offset-4"
                    style={{ color: 'rgb(var(--bb-text) / 0.92)', textDecorationColor: 'rgb(var(--bb-border) / 0.25)' }}
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}