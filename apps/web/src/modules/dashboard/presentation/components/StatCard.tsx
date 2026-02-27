import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type Props = {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
  to?: string
  onClick?: () => void
}

export function StatCard({ label, value, hint, icon, to, onClick }: Props) {
  const card = (
    <div className="bb-card bb-pop relative overflow-hidden rounded-[26px] p-4">
      <div className="pointer-events-none absolute inset-0 bb-shimmer opacity-60" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wider bb-muted-weak">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.98)' }}>
            {value}
          </p>

          {hint ? <p className="mt-1 text-xs font-semibold bb-muted-weak">{hint}</p> : null}
          {to || onClick ? <p className="mt-3 text-xs font-extrabold bb-muted-weak">Open →</p> : null}
        </div>

        {icon ? <div className="bb-stat-icon">{icon}</div> : null}
      </div>
    </div>
  )

  if (to) {
    return (
      <Link to={to} className="block">
        {card}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="block w-full text-left">
        {card}
      </button>
    )
  }

  return card
}