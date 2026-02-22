import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/modules/auth/application/context'

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await auth.login({ email, password })
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
            Welcome back
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">Login</h1>
          <p className="mt-3 text-base leading-7 text-white/70">Access your workspace.</p>

          <form onSubmit={onSubmit} className="mt-8 grid gap-4">
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
                placeholder="Your password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            <button
              disabled={auth.isLoading}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/90 to-cyan-400/80 px-5 py-3 text-sm font-extrabold text-white shadow-[0_18px_55px_rgba(99,102,241,0.20)] transition hover:-translate-y-0.5 disabled:opacity-60"
              type="submit"
            >
              {auth.isLoading ? 'Logging in...' : 'Login'}
            </button>

            <p className="mt-2 text-sm text-white/65">
              No account?{' '}
              <Link to="/register" className="font-extrabold text-cyan-300/90 hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}