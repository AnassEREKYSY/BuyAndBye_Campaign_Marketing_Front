import { useEffect, useMemo, useState } from 'react'
import { useNotificationsPage } from '@/modules/notifications/application/hooks/useNotificationsPage'
import { CheckIcon, TrashIcon } from '@heroicons/react/24/outline'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function formatDate(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString()
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
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-[rgb(var(--bb-text)/0.95)]">Notifications</h1>
          <p className="text-sm text-[rgb(var(--bb-muted)/0.80)]">{state.unreadCount} unread</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={actions.toggleOnlyUnread}
            className={cx('bb-nav-btn h-10 px-3', state.onlyUnread && 'bg-[rgb(var(--bb-border)/0.08)]')}
          >
            {state.onlyUnread ? 'Showing unread' : 'Show unread'}
          </button>

          <button type="button" onClick={actions.markAllRead} className="bb-nav-btn h-10 px-3">
            Mark all read
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-[rgb(var(--bb-border)/0.10)] bg-[rgb(var(--bb-card)/0.70)] p-3">
        {loading ? (
          <div className="p-6 text-sm text-[rgb(var(--bb-muted)/0.78)]">Loading...</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-[rgb(var(--bb-muted)/0.78)]">No notifications.</div>
        ) : (
          <ul className="divide-y divide-[rgb(var(--bb-border)/0.10)]">
            {items.map((n) => {
              const isUnread = !n.read_at
              return (
                <li key={n.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <button
                    type="button"
                    onClick={() => actions.markRead(n.id)}
                    className="text-left rounded-2xl p-1 -m-1 transition hover:bg-[rgb(var(--bb-border)/0.05)]"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className={cx(
                          'mt-1 inline-flex h-2.5 w-2.5 rounded-full',
                          isUnread ? 'bg-emerald-400' : 'bg-[rgb(var(--bb-border)/0.18)]',
                        )}
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={cx('font-extrabold', isUnread && 'text-[rgb(var(--bb-text)/0.98)]')}
                            style={{ color: isUnread ? 'rgb(var(--bb-text)/0.96)' : 'rgb(var(--bb-text)/0.86)' }}
                          >
                            {n.title}
                          </p>
                          <span className="text-xs text-[rgb(var(--bb-muted)/0.70)]">{formatDate(n.created_at)}</span>
                        </div>
                        {n.body ? <p className="mt-1 text-sm text-[rgb(var(--bb-muted)/0.86)]">{n.body}</p> : null}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 sm:pl-6">
                    <button type="button" onClick={() => actions.markRead(n.id)} className="bb-icon-btn h-10 w-10" aria-label="Mark read">
                      <CheckIcon className="h-5 w-5" />
                    </button>

                    <button type="button" onClick={() => actions.remove(n.id)} className="bb-icon-btn h-10 w-10" aria-label="Delete">
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={actions.prevPage} className="bb-nav-btn h-10 px-3" disabled={!canPrev || loading}>
          Previous
        </button>

        <div className="text-sm text-[rgb(var(--bb-muted)/0.78)]">Page {state.page}</div>

        <button type="button" onClick={actions.nextPage} className="bb-nav-btn h-10 px-3" disabled={!canNext || loading}>
          Next
        </button>
      </div>
    </div>
  )
}