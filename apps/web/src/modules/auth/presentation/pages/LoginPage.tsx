import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/modules/auth/application/context'
import { AuthCard, errorMessage } from './AuthCard'

const demoAccounts = [
  { label: 'Brand', email: 'brand@kickback.demo' },
  { label: 'Creator', email: 'creator@kickback.demo' },
]

export function LoginPage() {
  const auth = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await auth.login({ email, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'Email or password is incorrect.'))
    }
  }

  function fillDemo(demoEmail: string) {
    setEmail(demoEmail)
    setPassword('password')
    setError(null)
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your Kickback workspace."
      footer={
        <>
          New here?{' '}
          <Link to="/register" className="bb-link">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <div>
          <label className="bb-label" htmlFor="email">
            Email
          </label>
          <input id="email" className="bb-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" type="email" autoComplete="email" required />
        </div>
        <div>
          <label className="bb-label" htmlFor="password">
            Password
          </label>
          <input id="password" className="bb-input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required />
        </div>

        {error ? <p className="rounded-[10px] bg-bb-accent-soft px-3 py-2 text-sm text-bb-accent-strong">{error}</p> : null}

        <button disabled={auth.isLoading} className="bb-btn-primary w-full" type="submit">
          {auth.isLoading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 border-t border-bb-border/10 pt-4">
        <p className="text-xs text-bb-muted">Try a demo account</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {demoAccounts.map((d) => (
            <button key={d.email} type="button" onClick={() => fillDemo(d.email)} className="bb-btn-ghost h-9 text-xs">
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </AuthCard>
  )
}
