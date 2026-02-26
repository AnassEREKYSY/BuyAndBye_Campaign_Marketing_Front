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

function badge(status: CampaignApplication['status']) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold'
  if (status === 'pending') return `${base} bg-white/10 text-white/80`
  if (status === 'shortlisted') return `${base} bg-yellow-500/15 text-yellow-300`
  if (status === 'accepted') return `${base} bg-emerald-500/15 text-emerald-300`
  return `${base} bg-red-500/15 text-red-300`
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
  const rows = useMemo(() => items, [items])

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0e0f12] text-white">
      <div className="flex items-center justify-between border-b border-white/10 p-4">
        <div>
          <p className="text-sm font-extrabold">Applications</p>
          <p className="mt-1 text-xs text-white/50">Shortlist, finalize a candidate, and start collaboration.</p>
        </div>
        <div className="text-xs text-white/50">{rows.length} item(s)</div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="text-xs text-white/50">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3">Applicant</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Applied</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((a) => {
              const name = a.influencer?.displayName ?? 'Unknown influencer'
              const photo = a.influencer?.photoUrl
              const isMutating = mutatingId === a.id

              const canShortlist = a.status === 'pending'
              const canAccept = a.status === 'pending' || a.status === 'shortlisted'
              const canReject = a.status === 'pending' || a.status === 'shortlisted'

              return (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">
                    <button onClick={() => onOpen(a)} className="flex items-center gap-3 text-left">
                      <div className="h-9 w-9 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        {photo ? <img src={photo} className="h-full w-full object-cover" /> : null}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{name}</p>
                        <p className="text-xs text-white/50">{a.influencerId}</p>
                      </div>
                    </button>
                  </td>

                  <td className="px-4 py-3">
                    <span className={badge(a.status)}>{a.status}</span>
                  </td>

                  <td className="px-4 py-3 text-white/70">
                    {(a.message ?? '').trim() ? (
                      <span className="line-clamp-1">{a.message}</span>
                    ) : (
                      <span className="text-white/40">—</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-white/60">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        disabled={!canShortlist || isMutating}
                        onClick={() => onShortlist(a.id)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-extrabold text-white/90 disabled:opacity-50"
                      >
                        Shortlist
                      </button>

                      <button
                        disabled={!canAccept || isMutating}
                        onClick={() => onAccept(a.id)}
                        className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-xs font-extrabold text-emerald-200 disabled:opacity-50"
                      >
                        Finalize
                      </button>

                      <button
                        disabled={!canReject || isMutating}
                        onClick={() => onReject(a.id)}
                        className="rounded-full border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs font-extrabold text-red-200 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}

            {!rows.length && !loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-white/50">
                  No applications yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-4">
        <div className="text-xs text-white/50">
          {loading ? 'Loading…' : hasMore ? 'More applications available.' : 'End of list.'}
        </div>

        <button
          disabled={!hasMore || loading}
          onClick={onLoadMore}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-extrabold text-white/90 disabled:opacity-50"
        >
          Load more
        </button>
      </div>
    </div>
  )
}