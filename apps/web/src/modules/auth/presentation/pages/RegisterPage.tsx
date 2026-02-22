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
    navigate('/', { replace: true })
  }

  return (
    <div className="bb-page">
      <div className="bb-surface bb-surface-pad">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <span className="bb-chip">Get started</span>
            <h1 className="bb-title mt-4">Create account</h1>
            <p className="bb-p mt-4 max-w-xl">
              Choose your profile: <span className="font-extrabold text-white/90">{roleLabel}</span>.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-extrabold text-white/90">Clean onboarding</p>
                <p className="mt-2 text-sm leading-6 text-white/65">Fast signup and a premium first impression.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-extrabold text-white/90">Role based</p>
                <p className="mt-2 text-sm leading-6 text-white/65">Brand and influencer experiences are tailored.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bb-card">
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('brand')}
                  className={`rounded-2xl border px-4 py-3 text-sm font-extrabold transition ${
                    role === 'brand'
                      ? 'border-sky-400/45 bg-white/8 text-white'
                      : 'border-white/10 bg-black/10 text-white/75 hover:bg-white/6'
                  }`}
                >
                  Brand
                </button>
                <button
                  type="button"
                  onClick={() => setRole('influencer')}
                  className={`rounded-2xl border px-4 py-3 text-sm font-extrabold transition ${
                    role === 'influencer'
                      ? 'border-sky-400/45 bg-white/8 text-white'
                      : 'border-white/10 bg-black/10 text-white/75 hover:bg-white/6'
                  }`}
                >
                  Influencer
                </button>
              </div>

              <form onSubmit={onSubmit} className="mt-6 grid gap-4">
                <label className="grid gap-2 text-sm font-semibold text-white/80">
                  Full name
                  <input
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-sky-400/45 focus:bg-black/25"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your name"
                    type="text"
                    autoComplete="name"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-white/80">
                  Email
                  <input
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-sky-400/45 focus:bg-black/25"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-semibold text-white/80">
                  Password
                  <input
                    className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-sky-400/45 focus:bg-black/25"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </label>

                <button disabled={auth.isLoading} className="bb-btn-primary mt-2" type="submit">
                  {auth.isLoading ? 'Creating...' : 'Create account'}
                </button>

                <p className="mt-2 text-sm text-white/65">
                  Already have an account?{' '}
                  <Link to="/login" className="font-extrabold text-sky-300/90 hover:underline">
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