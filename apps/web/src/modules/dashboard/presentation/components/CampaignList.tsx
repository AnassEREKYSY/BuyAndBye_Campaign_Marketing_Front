import type { Campaign } from '@core/modules/dashboard'
type Props = {
  title: string
  campaigns: Campaign[]
  canApply: boolean
  onSelect?: (id: string) => void
  selectedId?: string | null
}

function statusPill(status: Campaign['status']) {
  if (status === 'published') return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
  if (status === 'closed') return 'border-rose-500/25 bg-rose-500/10 text-rose-200'
  return 'border-white/15 bg-white/5 text-white/75'
}

export function CampaignList({ title, campaigns, canApply, onSelect, selectedId }: Props) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#0e0f12] p-4 text-white shadow-[0_16px_44px_rgba(0,0,0,0.45)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-extrabold tracking-tight">{title}</p>
        <p className="text-xs font-semibold text-white/45">{campaigns.length} items</p>
      </div>

      <div className="mt-4 space-y-2">
        {campaigns.slice(0, 8).map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect?.(c.id)}
            className={`w-full rounded-2xl border px-4 py-3 text-left transition hover:-translate-y-0.5 ${
              selectedId === c.id ? 'border-white/20 bg-white/8' : 'border-white/10 bg-white/5'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold">{c.title}</p>
                <p className="mt-1 truncate text-xs font-semibold text-white/45">
                  {c.commissionType ? `${c.commissionType} • ${c.commissionValue ?? 0}` : '—'}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${statusPill(c.status)}`}>
                  {c.status}
                </span>

                {canApply && c.status === 'published' ? (
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-extrabold text-white/75">
                    Open
                  </span>
                ) : null}
              </div>
            </div>
          </button>
        ))}

        {campaigns.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-sm font-semibold text-white/50">
            No campaigns found.
          </div>
        ) : null}
      </div>

      <div className="mt-3 text-xs font-semibold text-white/40">
        {canApply ? 'Influencers can apply from campaign details.' : 'Brands can browse but cannot apply.'}
      </div>
    </div>
  )
}