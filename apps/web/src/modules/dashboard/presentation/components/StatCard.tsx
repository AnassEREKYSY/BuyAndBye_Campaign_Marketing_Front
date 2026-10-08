import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Stat } from '@/shared/components/ui'

type Props = {
  label: string
  value: ReactNode
  hint?: ReactNode
  icon?: ReactNode
  to?: string
  onClick?: () => void
}

const interactive =
  'block h-full w-full rounded-[14px] text-left transition-colors [&>.bb-card]:h-full hover:[&>.bb-card]:border-bb-border/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bb-primary/40'

/** Thin wrapper around the kit `Stat`, optionally clickable. */
export function StatCard({ label, value, hint, icon, to, onClick }: Props) {
  const card = <Stat label={label} value={value} hint={hint} icon={icon} />

  if (to) {
    return (
      <Link to={to} className={interactive}>
        {card}
      </Link>
    )
  }

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={interactive}>
        {card}
      </button>
    )
  }

  return card
}
