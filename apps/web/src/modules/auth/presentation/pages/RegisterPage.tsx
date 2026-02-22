import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useAuth } from '@/modules/auth/application/context'
import { UserRole } from '@core/modules/auth/domain/entities'

type Role = 'brand' | 'influencer'

const toUserRole = (role: Role): UserRole =>
  role === 'brand' ? UserRole.BRAND : UserRole.INFLUENCER

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
    await auth.register({
      role: toUserRole(role),
      email,
      displayName: fullName,
      password,
    })
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative z-10 mx-auto max-w-xl">
          <p className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
            Get started
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Create account</h1>
          <p className="mt-3 text-base leading-7 text-white/70">Choose your profile: {roleLabel}.</p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('brand')}
              className={`rounded-2xl border px-4 py-3 text-sm font-extrabold transition ${
                role === 'brand'
                  ? 'border-cyan-400/40 bg-white/8 text-white'
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
                  ? 'border-cyan-400/40 bg-white/8 text-white'
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
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:bg-black/25"
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
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:bg-black/25"
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
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition focus:border-cyan-400/50 focus:bg-black/25"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                type="password"
                autoComplete="new-password"
                required
              />
            </label>

            <button
              disabled={auth.isLoading}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/90 to-cyan-400/80 px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(34,211,238,0.14)] transition hover:-translate-y-0.5 disabled:opacity-60"
              type="submit"
            >
              {auth.isLoading ? 'Creating...' : 'Create account'}
            </button>

            <p className="mt-2 text-sm text-white/65">
              Already have an account?{' '}
              <Link to="/login" className="font-extrabold text-cyan-300/90 hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}