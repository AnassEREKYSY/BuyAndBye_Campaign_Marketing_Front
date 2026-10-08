import { useMemo } from 'react'
import type { CampaignApplication } from '@core/modules/dashboard/domain/entities'
import { Section, Skeleton, StatusBadge, formatDate } from '@/shared/components/ui'

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

export function CampaignApplicationsTable({ items, loading, mutatingId, onOpen, onShortlist, onAccept, onReject, onLoadMore, hasMore }: Props) {
  const rows = useMemo(() => items ?? [], [items])

  return (
    <Section
      title="Applications"
      description="Shortlist, then accept. Accepting starts the collaboration."
      actions={<span className="text-xs text-bb-muted">{rows.length} total</span>}
      bodyClassName="px-0 pb-0"
    >
      {loading && rows.length === 0 ? (
        <div className="grid gap-2 px-5 pb-5">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      ) : rows.length === 0 ? (
        <p className="px-5 pb-5 text-sm text-bb-muted">No applications yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="bb-table min-w-[720px]">
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
              {rows.map((a) => {
                const name = a.influencer?.displayName ?? 'Unknown creator'
                const photo = a.influencer?.photoUrl ?? null
                const isMutating = mutatingId === a.id
                const canShortlist = a.status === 'pending'
                const canAccept = a.status === 'pending' || a.status === 'shortlisted'
                const canReject = a.status === 'pending' || a.status === 'shortlisted'

                return (
                  <tr key={a.id} className="bb-tr bb-tr-hover">
                    <td className="bb-td">
                      <button type="button" onClick={() => onOpen(a)} className="flex items-center gap-3 text-left hover:text-bb-primary-strong">
                        <span className="bb-avatar">{photo ? <img src={photo} alt="" className="h-full w-full object-cover" /> : name.charAt(0).toUpperCase()}</span>
                        <span className="truncate font-medium">{name}</span>
                      </button>
                    </td>
                    <td className="bb-td">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="bb-td max-w-[220px] text-bb-muted">{(a.message ?? '').trim() ? <span className="line-clamp-1">{a.message}</span> : '—'}</td>
                    <td className="bb-td whitespace-nowrap text-bb-muted">{formatDate(a.createdAt)}</td>
                    <td className="bb-td">
                      <div className="flex items-center justify-end gap-2">
                        {canShortlist ? (
                          <button type="button" disabled={isMutating} onClick={() => onShortlist(a.id)} className="bb-btn-ghost h-9 px-3">
                            Shortlist
                          </button>
                        ) : null}
                        {canAccept ? (
                          <button type="button" disabled={isMutating} onClick={() => onAccept(a.id)} className="bb-btn-primary h-9 px-3">
                            Accept
                          </button>
                        ) : null}
                        {canReject ? (
                          <button type="button" disabled={isMutating} onClick={() => onReject(a.id)} className="bb-btn-ghost h-9 px-3">
                            Reject
                          </button>
                        ) : null}
                        {!canShortlist && !canAccept && !canReject ? <span className="text-xs text-bb-muted">No actions</span> : null}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {hasMore ? (
        <div className="border-t border-bb-border/10 px-5 py-3 text-center">
          <button type="button" disabled={loading} onClick={onLoadMore} className="bb-btn-ghost h-9">
            {loading ? 'Loading…' : 'Load more'}
          </button>
        </div>
      ) : null}
    </Section>
  )
}
