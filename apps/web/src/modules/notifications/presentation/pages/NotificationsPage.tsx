import { useEffect, useMemo, useState } from 'react'
import { useNotificationsPage } from '@/modules/notifications/application/hooks/useNotificationsPage'
import { TrashIcon, CheckIcon } from '@heroicons/react/24/outline'

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
        const list = (res.data ?? []).filter((n) => !state.dismissedIds.has(n.id))
        setItems(list)
        setMeta(res.meta ?? null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [inbox, state.page, state.onlyUnread, state.dismissedIds])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
            Notifications
          </h1>
          <p className="text-sm" style={{ color: 'rgb(var(--bb-text) / 0.65)' }}>
            {state.unreadCount} unread
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={actions.toggleOnlyUnread}
            className={cx('bb-nav-btn h-10 px-3', state.onlyUnread && 'bg-white/10')}
          >
            {state.onlyUnread ? 'Showing unread' : 'Show unread'}
          </button>

          <button type="button" onClick={actions.markAllRead} className="bb-nav-btn h-10 px-3">
            Mark all read
          </button>

          <button type="button" onClick={actions.clearHidden} className="bb-nav-btn h-10 px-3">
            Clear hidden
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-3">
        {loading ? (
          <div className="p-6 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.65)' }}>
            Loading...
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.65)' }}>
            No notifications.
          </div>
        ) : (
          <ul className="divide-y divide-white/10">
            {items.map((n) => {
              const isUnread = !n.read_at
              return (
                <li key={n.id} className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between">
                  <button type="button" onClick={() => actions.markRead(n.id)} className="text-left">
                    <div className="flex items-start gap-3">
                      <span className={cx('mt-1 inline-flex h-2.5 w-2.5 rounded-full', isUnread ? 'bg-emerald-400' : 'bg-white/20')} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p
                            className={cx('font-extrabold', isUnread && 'text-white')}
                            style={{ color: isUnread ? 'rgb(var(--bb-text) / 0.95)' : 'rgb(var(--bb-text) / 0.85)' }}
                          >
                            {n.title}
                          </p>
                          <span className="text-xs" style={{ color: 'rgb(var(--bb-text) / 0.55)' }}>
                            {formatDate(n.created_at)}
                          </span>
                        </div>
                        {n.body ? (
                          <p className="mt-1 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.70)' }}>
                            {n.body}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </button>

                  <div className="flex items-center gap-2 sm:pl-6">
                    <button type="button" onClick={() => actions.markRead(n.id)} className="bb-icon-btn h-10 w-10" aria-label="Mark read">
                      <CheckIcon className="h-5 w-5" />
                    </button>

                    <button type="button" onClick={() => actions.hide(n.id)} className="bb-icon-btn h-10 w-10" aria-label="Hide">
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

        <div className="text-sm" style={{ color: 'rgb(var(--bb-text) / 0.65)' }}>
          Page {state.page}
        </div>

        <button type="button" onClick={actions.nextPage} className="bb-nav-btn h-10 px-3" disabled={!canNext || loading}>
          Next
        </button>
      </div>
    </div>
  )
}