import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInboxNotifications } from '@/shared/context/inboxNotifications'
import { BellIcon, CheckIcon, TrashIcon, ArrowRightIcon } from '@heroicons/react/24/outline'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function fmt(ts?: string | null) {
  if (!ts) return ''
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString()
}

export function NotificationsDropdown() {
  const nav = useNavigate()
  const inbox = useInboxNotifications()
  const ref = useRef<HTMLDivElement | null>(null)
  const [busyIds, setBusyIds] = useState<Record<string, boolean>>({})
  const [busyAll, setBusyAll] = useState(false)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!inbox.isOpen) return
      const el = ref.current
      if (!el) return
      if (e.target instanceof Node && el.contains(e.target)) return
      inbox.close()
    }
    window.addEventListener('mousedown', onDown)
    return () => window.removeEventListener('mousedown', onDown)
  }, [inbox])

  async function markOneRead(id: string) {
    setBusyIds((p) => ({ ...p, [id]: true }))
    try {
      await inbox.markRead(id)
    } finally {
      setBusyIds((p) => {
        const n = { ...p }
        delete n[id]
        return n
      })
    }
  }

  async function removeOne(id: string) {
    setBusyIds((p) => ({ ...p, [id]: true }))
    try {
      await inbox.remove(id)
    } finally {
      setBusyIds((p) => {
        const n = { ...p }
        delete n[id]
        return n
      })
    }
  }

  async function markAll() {
    setBusyAll(true)
    try {
      await inbox.markAllRead()
    } finally {
      setBusyAll(false)
    }
  }

  const hasAnyBusy = busyAll || Object.keys(busyIds).length > 0

  const visibleItems = useMemo(() => {
    return inbox.latest.slice(0, 6)
  }, [inbox.latest])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        className="bb-icon-btn h-10 w-10 relative"
        onClick={() => {
          inbox.toggle()
          if (!inbox.isOpen) void inbox.refresh({ silent: true } as any)
        }}
        aria-label="Notifications"
      >
        <BellIcon className="h-5 w-5" />
        {inbox.unreadCount > 0 ? (
          <span
            className="absolute -right-1 -top-1 grid h-5 min-w-[20px] place-items-center rounded-full px-1 text-[11px] font-black text-white"
            style={{ backgroundColor: 'rgb(244 63 94 / 0.95)' }}
          >
            {inbox.unreadCount > 99 ? '99+' : inbox.unreadCount}
          </span>
        ) : null}
      </button>

      <div
        className={cx(
          'absolute right-0 mt-2 w-[360px] max-w-[calc(100vw-2rem)] origin-top-right rounded-3xl border overflow-hidden',
          inbox.isOpen ? 'block' : 'hidden',
        )}
        style={{
          borderColor: 'rgb(var(--bb-border) / 0.10)',
          backgroundColor: 'rgb(var(--bb-surface) / 0.86)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <div className="pointer-events-none absolute inset-0 bb-spotlight" />
        <div className="pointer-events-none absolute inset-0 bb-grid" />
        <div className="pointer-events-none absolute inset-0 bb-noise" />

        <div className="relative p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-black text-[rgb(var(--bb-text)/0.96)]">Notifications</p>
              <p className="text-xs font-semibold text-[rgb(var(--bb-muted)/0.86)]">
                {inbox.unreadCount} unread
              </p>
            </div>

            <button type="button" onClick={() => void markAll()} className="bb-btn-ghost h-9 px-3" disabled={hasAnyBusy}>
              <span className="inline-flex items-center gap-2">
                <CheckIcon className="h-4 w-4" />
                Read all
              </span>
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {!inbox.isLoading && visibleItems.length === 0 ? (
              <div className="rounded-2xl border border-[rgb(var(--bb-border)/0.10)] bg-[rgb(var(--bb-border)/0.04)] p-4 text-sm font-semibold text-[rgb(var(--bb-muted)/0.90)]">
                No notifications yet.
              </div>
            ) : null}

            {visibleItems.map((n) => {
              const busy = !!busyIds[n.id] || busyAll
              const isUnread = !n.read_at

              return (
                <div
                  key={n.id}
                  className={cx(
                    'rounded-2xl border p-3 transition',
                    busy ? 'opacity-70' : 'opacity-100',
                  )}
                  style={{
                    borderColor: 'rgb(var(--bb-border)/0.10)',
                    backgroundColor: isUnread ? 'rgb(var(--bb-border)/0.05)' : 'rgb(var(--bb-border)/0.03)',
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-[rgb(var(--bb-text)/0.94)]">{n.title}</p>
                      {n.body ? <p className="mt-1 text-xs font-semibold text-[rgb(var(--bb-muted)/0.88)]">{n.body}</p> : null}
                      <p className="mt-2 text-[11px] font-bold text-[rgb(var(--bb-muted)/0.78)]">{fmt(n.created_at)}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!n.read_at ? (
                        <button
                          type="button"
                          className="bb-icon-btn h-9 w-9"
                          onClick={() => void markOneRead(n.id)}
                          aria-label="Mark read"
                          disabled={busy}
                        >
                          <CheckIcon className="h-5 w-5" />
                        </button>
                      ) : null}

                      <button
                        type="button"
                        className="bb-icon-btn h-9 w-9"
                        onClick={() => void removeOne(n.id)}
                        aria-label="Delete"
                        disabled={busy}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            type="button"
            className="mt-3 w-full bb-btn-ghost h-10"
            onClick={() => {
              inbox.close()
              nav('/notifications')
            }}
          >
            <span className="inline-flex items-center justify-center gap-2">
              See all
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}