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
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="bb-page px-4 py-6 md:px-6">
      <div className="bb-surface bb-surface-pad bb-pop">
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <span className="bb-chip">Welcome back</span>
            <h1 className="bb-title mt-4">Login</h1>
            <p className="bb-p mt-4 max-w-xl">Access your workspace with a clean, secure experience.</p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="bb-card p-4">
                <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  Fast access
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  Login and continue your workflow instantly.
                </p>
              </div>

              <div className="bb-card p-4">
                <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  Secure
                </p>
                <p className="mt-2 text-sm leading-6" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  Token-based authentication via API.
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bb-card">
              <form onSubmit={onSubmit} className="grid gap-4">
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
                    placeholder="Your password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </label>

                <button disabled={auth.isLoading} className="bb-btn-primary mt-2" type="submit">
                  {auth.isLoading ? 'Logging in…' : 'Login'}
                </button>

                <p className="mt-2 text-sm" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                  No account?{' '}
                  <Link
                    to="/register"
                    className="font-extrabold underline underline-offset-4"
                    style={{ color: 'rgb(var(--bb-text) / 0.92)', textDecorationColor: 'rgb(var(--bb-border) / 0.25)' }}
                  >
                    Create one
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