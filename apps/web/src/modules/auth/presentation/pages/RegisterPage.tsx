import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { MegaphoneIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/modules/auth/application/context'
import { UserRole } from '@core/modules/auth/domain/entities'
import { AuthCard, errorMessage } from './AuthCard'

type Role = 'brand' | 'influencer'
const toUserRole = (role: Role) => (role === 'brand' ? UserRole.BRAND : UserRole.INFLUENCER)

function parseRole(v: string | null): Role | null {
  const x = (v ?? '').toLowerCase()
  return x === 'brand' || x === 'influencer' ? x : null
}

const roles: Array<{ value: Role; title: string; text: string; icon: typeof MegaphoneIcon }> = [
  { value: 'brand', title: "I'm a brand", text: 'Launch campaigns', icon: MegaphoneIcon },
  { value: 'influencer', title: "I'm a creator", text: 'Promote and earn', icon: SparklesIcon },
]

export function RegisterPage() {
  const auth = useAuth()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [role, setRole] = useState<Role>(() => parseRole(searchParams.get('role')) ?? 'brand')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const next = parseRole(searchParams.get('role'))
    if (next && next !== role) setRole(next)
  }, [searchParams, role])

  function pickRole(next: Role) {
    setRole(next)
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev)
      p.set('role', next)
      return p
    })
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await auth.register({ role: toUserRole(role), email, displayName: fullName, password })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'Could not create the account. Please check the fields.'))
    }
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Free to use. Takes less than a minute."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="bb-link">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="grid gap-4">
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Account type">
          {roles.map((r) => {
            const active = role === r.value
            const Icon = r.icon
            return (
              <button
                key={r.value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => pickRole(r.value)}
                className={`rounded-[10px] border p-3 text-left transition-colors ${
                  active ? 'border-bb-primary bg-bb-primary-soft' : 'border-bb-border/15 hover:bg-bb-subtle'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'text-bb-primary-strong' : 'text-bb-muted'}`} />
                <span className="mt-2 block text-sm font-medium">{r.title}</span>
                <span className="block text-xs text-bb-muted">{r.text}</span>
              </button>
            )
          })}
        </div>

        <div>
          <label className="bb-label" htmlFor="name">
            {role === 'brand' ? 'Brand name' : 'Full name'}
          </label>
          <input id="name" className="bb-input" value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" autoComplete="name" required />
        </div>
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
          <input id="password" className="bb-input" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" minLength={8} required />
          <p className="mt-1.5 text-xs text-bb-muted">At least 8 characters, with upper and lower case letters and a number.</p>
        </div>

        {error ? <p className="rounded-[10px] bg-bb-accent-soft px-3 py-2 text-sm text-bb-accent-strong">{error}</p> : null}

        <button disabled={auth.isLoading} className="bb-btn-primary w-full" type="submit">
          {auth.isLoading ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthCard>
  )
}
