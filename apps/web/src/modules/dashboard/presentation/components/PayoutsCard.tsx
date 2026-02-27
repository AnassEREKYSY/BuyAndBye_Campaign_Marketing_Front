import type { Payout } from '@core/modules/dashboard'

type Props = {
  title: string
  payouts: Payout[]
}

function money(amount: number, currency: string) {
  const v = Number.isFinite(amount) ? amount : 0
  return `${v.toFixed(2)} ${currency}`
}

function pill(status?: string) {
  const s = (status ?? '').toLowerCase()
  if (s === 'paid' || s === 'completed') return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
  if (s === 'pending' || s === 'processing') return 'border-amber-500/25 bg-amber-500/10 text-amber-200'
  if (s === 'failed' || s === 'rejected') return 'border-rose-500/25 bg-rose-500/10 text-rose-200'
  return 'border-slate-400/25 bg-slate-500/10 text-slate-200'
}

export function PayoutsCard({ title, payouts }: Props) {
  const currency = payouts[0]?.currency ?? 'MAD'
  const total = payouts.reduce((acc, p) => acc + (Number(p.amount) || 0), 0)

  return (
    <div className="bb-card bb-pop relative overflow-hidden rounded-[26px] p-4">
      <div className="pointer-events-none absolute inset-0 bb-spotlight opacity-60" />
      <div className="pointer-events-none absolute inset-0 bb-noise" />

      <div className="relative flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
          {title}
        </p>
        <p className="text-xs font-extrabold" style={{ color: 'rgb(var(--bb-muted) / 0.85)' }}>
          {money(total, currency)}
        </p>
      </div>

      <div className="relative mt-4 space-y-2">
        {payouts.length === 0 ? (
          <div className="bb-soft-box p-4 text-center text-sm font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
            No payouts yet.
          </div>
        ) : (
          payouts.slice(0, 6).map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-2xl border px-4 py-3"
              style={{
                borderColor: 'rgb(var(--bb-border) / 0.10)',
                backgroundColor: 'rgb(var(--bb-border) / 0.04)',
              }}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-extrabold ${pill(p.status)}`}>
                    {p.status ?? '—'}
                  </span>
                </div>
                <p className="mt-2 truncate text-[11px] font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.80)' }}>
                  {p.collaborationId}
                </p>
              </div>

              <p className="shrink-0 text-xs font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                {money(p.amount, p.currency)}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}