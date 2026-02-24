import type { ReactNode } from 'react'

type Props = {
  label: string
  value: string
  hint?: string
  icon?: ReactNode
}

export function StatCard({ label, value, hint, icon }: Props) {
  return (
    <div className="bb-gradient-border bb-glass bb-ring relative overflow-hidden rounded-[26px] border border-white/10 p-4 text-white transition will-change-transform hover:-translate-y-0.5">
      <div className="bb-shimmer pointer-events-none absolute inset-0 opacity-70" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-extrabold uppercase tracking-wider text-white/50">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight text-white">{value}</p>
          {hint ? <p className="mt-1 text-xs font-semibold text-white/45">{hint}</p> : null}
        </div>

        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80">
            {icon}
          </div>
        ) : null}
      </div>
    </div>
  )
}