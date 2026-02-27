// apps/web/src/modules/dashboard/presentation/components/CampaignApplicationsTable.tsx
import { useMemo } from 'react'
import type { CampaignApplication } from '@core/modules/dashboard/domain/entities'

type Props = {
  items: CampaignApplication[]
  loading: boolean
  mutatingId: string | null
  onOpen: (app: CampaignApplication) => void
  onShortlist: (id: string) => void
  onAccept: (id: string) => void
  onReject: (id: string) => void
  onLoadMore: () => void
  hasMore: boolean
}

function pill(status: CampaignApplication['status']) {
  const s = String(status ?? '').toLowerCase()
  if (s === 'pending') return 'border-slate-400/25 bg-slate-500/10 text-slate-200'
  if (s === 'shortlisted') return 'border-amber-500/25 bg-amber-500/10 text-amber-200'
  if (s === 'accepted') return 'border-emerald-500/25 bg-emerald-500/10 text-emerald-200'
  return 'border-rose-500/25 bg-rose-500/10 text-rose-200'
}

export function CampaignApplicationsTable({
  items,
  loading,
  mutatingId,
  onOpen,
  onShortlist,
  onAccept,
  onReject,
  onLoadMore,
  hasMore,
}: Props) {
  const rows = useMemo(() => items ?? [], [items])

  return (
    <div className="bb-card bb-pop rounded-[26px] p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.96)' }}>
            Applications
          </p>
          <p className="mt-1 text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
            Shortlist, finalize, then collaboration starts automatically.
          </p>
        </div>

        <div className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
          {rows.length} item(s)
        </div>
      </div>

      <div className="mt-4 bb-table-wrap">
        <div className="overflow-x-auto">
          <table className="bb-table min-w-[920px]">
            <thead className="bb-thead">
              <tr>
                <th className="bb-th">Applicant</th>
                <th className="bb-th">Status</th>
                <th className="bb-th">Message</th>
                <th className="bb-th">Applied</th>
                <th className="bb-th text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading && rows.length === 0 ? (
                <tr className="bb-tr">
                  <td className="bb-td" colSpan={5} style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                    Loading…
                  </td>
                </tr>
              ) : null}

              {!loading && rows.length === 0 ? (
                <tr className="bb-tr">
                  <td className="bb-td" colSpan={5} style={{ color: 'rgb(var(--bb-muted) / 0.90)' }}>
                    No applications yet.
                  </td>
                </tr>
              ) : null}

              {rows.map((a) => {
                const name = a.influencer?.displayName ?? 'Unknown influencer'
                const photo = a.influencer?.photoUrl ?? null
                const isMutating = mutatingId === a.id

                const canShortlist = a.status === 'pending'
                const canAccept = a.status === 'pending' || a.status === 'shortlisted'
                const canReject = a.status === 'pending' || a.status === 'shortlisted'

                return (
                  <tr key={a.id} className="bb-tr bb-tr-hover">
                    <td className="bb-td">
                      <button onClick={() => onOpen(a)} className="flex items-center gap-3 text-left">
                        <div
                          className="h-10 w-10 overflow-hidden rounded-2xl border"
                          style={{
                            borderColor: 'rgb(var(--bb-border) / 0.10)',
                            backgroundColor: 'rgb(var(--bb-border) / 0.04)',
                          }}
                        >
                          {photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : null}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                            {name}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold bb-muted-weak">{a.influencerId}</p>
                        </div>
                      </button>
                    </td>

                    <td className="bb-td">
                      <span className={`rounded-full border px-3 py-1 text-[11px] font-extrabold ${pill(a.status)}`}>
                        {a.status}
                      </span>
                    </td>

                    <td className="bb-td bb-muted">
                      {(a.message ?? '').trim() ? <span className="line-clamp-1">{a.message}</span> : '—'}
                    </td>

                    <td className="bb-td bb-muted">
                      {a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}
                    </td>

                    <td className="bb-td">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={!canShortlist || isMutating}
                          onClick={() => onShortlist(a.id)}
                          className="bb-btn-ghost h-10 px-4 disabled:opacity-60"
                        >
                          Shortlist
                        </button>

                        <button
                          disabled={!canAccept || isMutating}
                          onClick={() => onAccept(a.id)}
                          className="bb-btn-primary h-10 px-4 disabled:opacity-60"
                        >
                          Finalize
                        </button>

                        <button
                          disabled={!canReject || isMutating}
                          onClick={() => onReject(a.id)}
                          className="bb-btn-ghost h-10 px-4 disabled:opacity-60"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="text-xs font-semibold" style={{ color: 'rgb(var(--bb-muted) / 0.82)' }}>
          {loading ? 'Loading…' : hasMore ? 'More applications available.' : 'End of list.'}
        </div>

        <button
          disabled={!hasMore || loading}
          onClick={onLoadMore}
          className="bb-btn-ghost h-10 px-4 disabled:opacity-60"
        >
          Load more
        </button>
      </div>
    </div>
  )
}