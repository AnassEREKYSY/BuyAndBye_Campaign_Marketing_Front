import type { Payout } from '@core/modules/dashboard'

type Props = {
  title: string
  payouts: Payout[]
}

function money(amount: number, currency: string) {
  const v = Number.isFinite(amount) ? amount : 0
  return `${v.toFixed(2)} ${currency}`
}

export function PayoutsCard({ title, payouts }: Props) {
  const currency = payouts[0]?.currency ?? 'MAD'
  const total = payouts.reduce((acc, p) => acc + (Number(p.amount) || 0), 0)

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0e0f12] p-4 text-white shadow-[0_16px_44px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold tracking-tight">{title}</p>
        <p className="text-xs font-extrabold text-white/60">{money(total, currency)}</p>
      </div>

      <div className="mt-4 space-y-2">
        {payouts.slice(0, 6).map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-extrabold text-white/75">{p.status}</p>
              <p className="mt-1 truncate text-[11px] font-semibold text-white/40">{p.collaborationId}</p>
            </div>
            <p className="shrink-0 text-xs font-extrabold">{money(p.amount, p.currency)}</p>
          </div>
        ))}

        {payouts.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm font-semibold text-white/50">
            No payouts yet.
          </div>
        ) : null}
      </div>
    </div>
  )
}