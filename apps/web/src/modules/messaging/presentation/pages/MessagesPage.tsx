import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useConversations } from '@/modules/messaging/application/hooks'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function formatTime(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Avatar({ seed }: { seed: string }) {
  const initial = (seed ?? '').trim().slice(0, 1).toUpperCase() || 'B'
  return (
    <div
      className="grid h-10 w-10 place-items-center rounded-2xl border"
      style={{
        borderColor: 'rgb(var(--bb-border) / 0.12)',
        backgroundColor: 'rgb(var(--bb-border) / 0.06)',
        color: 'rgb(var(--bb-text) / 0.92)',
      }}
    >
      <span className="text-sm font-extrabold">{initial}</span>
    </div>
  )
}

export default function MessagesPage() {
  const location = useLocation()
  const { loading, data, error } = useConversations()
  const [q, setQ] = useState('')

  const conversations = data?.data ?? []

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return conversations
    return conversations.filter((c) => (c.campaign?.title ?? 'Conversation').toLowerCase().includes(needle))
  }, [conversations, q])

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-extrabold tracking-tight" style={{ color: 'rgb(var(--bb-text) / 0.95)' }}>
            Messages
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.60)' }}>
            Conversations with brands and influencers
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <aside
          className="overflow-hidden rounded-3xl border"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.12)',
            backgroundColor: 'rgb(var(--bb-bg) / 0.30)',
          }}
        >
          <div className="border-b p-3" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                Inbox
              </p>
              <span className="text-xs" style={{ color: 'rgb(var(--bb-text) / 0.55)' }}>
                {loading ? 'Loading…' : `${conversations.length} conversations`}
              </span>
            </div>

            <div className="mt-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                type="text"
                placeholder="Search conversations..."
                className="h-10 w-full rounded-2xl border bg-transparent px-3 text-sm outline-none"
                style={{
                  borderColor: 'rgb(var(--bb-border) / 0.12)',
                  color: 'rgb(var(--bb-text) / 0.90)',
                }}
              />
            </div>
          </div>

          <ul className="max-h-[72vh] overflow-auto p-2">
            {error ? (
              <li className="p-4 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.70)' }}>
                {error}
              </li>
            ) : loading ? (
              <li className="p-4 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.70)' }}>
                Loading conversations...
              </li>
            ) : filtered.length === 0 ? (
              <li className="p-4 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.70)' }}>
                No conversations.
              </li>
            ) : (
              filtered.map((c) => {
                const title = c.campaign?.title ?? 'Conversation'
                const isActive = location.pathname === `/messages/${c.id}`
                const time = formatTime((c as any).last_message_at ?? c.updated_at ?? null)
                const unread = Number((c as any).unread_count ?? 0)
                const preview = ((c as any).last_message_body ?? '').trim()

                return (
                  <li key={c.id} className="p-1">
                    <NavLink
                      to={`/messages/${c.id}`}
                      className={cx(
                        'group flex items-start gap-3 rounded-3xl border p-3 transition',
                        'hover:-translate-y-[1px] hover:bg-white/5',
                        isActive && 'bg-white/5',
                      )}
                      style={{
                        borderColor: isActive ? 'rgb(var(--bb-border) / 0.18)' : 'rgb(var(--bb-border) / 0.10)',
                      }}
                    >
                      <Avatar seed={title} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                              {title}
                            </p>
                            <p className="mt-0.5 truncate text-xs" style={{ color: 'rgb(var(--bb-text) / 0.55)' }}>
                              {c.status === 'closed' ? 'Closed conversation' : 'Active conversation'}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[11px]" style={{ color: 'rgb(var(--bb-text) / 0.55)' }}>
                              {time}
                            </span>
                            {unread > 0 ? (
                              <span className="grid h-5 min-w-[1.25rem] place-items-center rounded-full bg-emerald-500 px-1 text-[11px] font-extrabold text-white">
                                {unread > 99 ? '99+' : unread}
                              </span>
                            ) : (
                              <span className="h-5" />
                            )}
                          </div>
                        </div>

                        <p className="mt-2 line-clamp-2 text-xs" style={{ color: 'rgb(var(--bb-text) / 0.70)' }}>
                          {preview || (c.status === 'closed' ? 'This conversation is archived.' : 'No messages yet.')}
                        </p>
                      </div>
                    </NavLink>
                  </li>
                )
              })
            )}
          </ul>
        </aside>

        <main
          className="min-h-[72vh] overflow-hidden rounded-3xl border"
          style={{
            borderColor: 'rgb(var(--bb-border) / 0.12)',
            backgroundColor: 'rgb(var(--bb-bg) / 0.30)',
          }}
        >
          <Outlet />

          {location.pathname === '/messages' ? (
            <div className="grid h-full place-items-center p-10">
              <div className="max-w-md text-center">
                <div
                  className="mx-auto grid h-12 w-12 place-items-center rounded-3xl border"
                  style={{
                    borderColor: 'rgb(var(--bb-border) / 0.12)',
                    backgroundColor: 'rgb(var(--bb-border) / 0.06)',
                    color: 'rgb(var(--bb-text) / 0.90)',
                  }}
                >
                  <span className="text-lg font-extrabold">✦</span>
                </div>
                <h2 className="mt-4 text-lg font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                  Select a conversation
                </h2>
                <p className="mt-2 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.65)' }}>
                  Open a thread on the left to view messages and reply.
                </p>
              </div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}