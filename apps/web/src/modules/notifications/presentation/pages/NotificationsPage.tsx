import { useEffect, useMemo, useState } from 'react'
import { BellIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useNotificationsPage } from '@/modules/notifications/application/hooks/useNotificationsPage'
import { EmptyState, PageHeader, Segmented, Skeleton } from '@/shared/components/ui'

function formatWhen(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function NotificationsPage() {
  const { inbox, state, actions } = useNotificationsPage()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState(inbox.latest)
  const [meta, setMeta] = useState<any>(null)

  const canPrev = useMemo(() => state.page > 1, [state.page])
  const canNext = useMemo(() => !!meta?.next_page_url, [meta])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    ;(async () => {
      try {
        const res = await inbox.list({ page: state.page, size: 20, unread: state.onlyUnread })
        if (cancelled) return
        setItems(res.data ?? [])
        setMeta(res.meta ?? null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [inbox, state.page, state.onlyUnread])

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={state.unreadCount > 0 ? `${state.unreadCount} unread` : 'You are all caught up.'}
        actions={
          <>
            <Segmented
              value={state.onlyUnread ? 'unread' : 'all'}
              options={[
                { value: 'all', label: 'All' },
                { value: 'unread', label: 'Unread' },
              ]}
              onChange={(v) => {
                if ((v === 'unread') !== state.onlyUnread) actions.toggleOnlyUnread()
              }}
            />
            <button type="button" onClick={actions.markAllRead} className="bb-btn-ghost h-9" disabled={state.unreadCount === 0}>
              <CheckIcon className="h-4 w-4" />
              Mark all read
            </button>
          </>
        }
      />

      {loading ? (
        <div className="bb-card space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={<BellIcon className="h-5 w-5" />}
          title={state.onlyUnread ? 'No unread notifications' : 'No notifications yet'}
          text="Applications, collaboration updates and payouts will show up here."
        />
      ) : (
        <ul className="bb-card divide-y divide-bb-border/[0.08] p-0">
          {items.map((n) => {
            const isUnread = !n.read_at
            return (
              <li key={n.id} className="group flex items-start gap-3 px-5 py-4">
                <span className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${isUnread ? 'bg-bb-accent' : 'bg-transparent'}`} aria-label={isUnread ? 'Unread' : undefined} />
                <button type="button" onClick={() => actions.markRead(n.id)} className="min-w-0 flex-1 text-left">
                  <span className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <span className={`text-sm ${isUnread ? 'font-semibold text-bb-text' : 'font-medium text-bb-text/80'}`}>{n.title}</span>
                    <span className="shrink-0 text-xs text-bb-muted">{formatWhen(n.created_at)}</span>
                  </span>
                  {n.body ? <span className="mt-1 block text-sm text-bb-muted">{n.body}</span> : null}
                </button>
                <span className="flex shrink-0 items-center gap-1">
                  {isUnread ? (
                    <button type="button" onClick={() => actions.markRead(n.id)} className="bb-icon-btn h-8 w-8" aria-label="Mark as read" title="Mark as read">
                      <CheckIcon className="h-[18px] w-[18px]" />
                    </button>
                  ) : null}
                  <button type="button" onClick={() => actions.remove(n.id)} className="bb-icon-btn h-8 w-8 hover:text-bb-accent-strong" aria-label="Delete" title="Delete">
                    <TrashIcon className="h-[18px] w-[18px]" />
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {canPrev || canNext ? (
        <div className="mt-4 flex items-center justify-between">
          <button type="button" onClick={actions.prevPage} className="bb-btn-ghost h-9" disabled={!canPrev || loading}>
            Previous
          </button>
          <span className="text-sm text-bb-muted">Page {state.page}</span>
          <button type="button" onClick={actions.nextPage} className="bb-btn-ghost h-9" disabled={!canNext || loading}>
            Next
          </button>
        </div>
      ) : null}
    </div>
  )
}
