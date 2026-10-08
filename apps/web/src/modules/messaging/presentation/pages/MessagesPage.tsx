import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { ChatBubbleLeftRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useConversations } from '@/modules/messaging/application/hooks'
import { PageHeader, Skeleton } from '@/shared/components/ui'

function formatTime(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const sameDay = d.toDateString() === new Date().toDateString()
  return sameDay ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export default function MessagesPage() {
  const location = useLocation()
  const { loading, data, error } = useConversations()
  const [q, setQ] = useState('')

  const conversations = data?.data ?? []
  const inThread = location.pathname !== '/messages' && location.pathname !== '/messages/'

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    if (!needle) return conversations
    return conversations.filter((c) => (c.campaign?.title ?? 'Conversation').toLowerCase().includes(needle))
  }, [conversations, q])

  return (
    <div>
      <PageHeader title="Messages" description="Conversations between brands and creators, one per collaboration." />

      <div className="bb-card grid h-[calc(100vh-13rem)] min-h-[480px] grid-cols-1 overflow-hidden p-0 lg:grid-cols-[320px_1fr]">
        {/* Conversation list */}
        <aside className={`min-h-0 flex-col border-bb-border/10 lg:flex lg:border-r ${inThread ? 'hidden' : 'flex'}`}>
          <div className="border-b border-bb-border/10 p-3">
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-bb-muted" />
              <input value={q} onChange={(e) => setQ(e.target.value)} type="search" placeholder="Search conversations" className="bb-input h-9 pl-9" aria-label="Search conversations" />
            </div>
            <p className="mt-2 px-1 text-xs text-bb-muted">{loading ? 'Loading…' : `${conversations.length} conversation${conversations.length === 1 ? '' : 's'}`}</p>
          </div>

          <ul className="bb-soft-scroll min-h-0 flex-1 overflow-auto p-2">
            {error ? (
              <li className="m-1 rounded-[10px] bg-bb-accent-soft p-3 text-sm text-bb-accent-strong">{error}</li>
            ) : loading ? (
              [0, 1, 2, 3].map((i) => (
                <li key={i} className="flex gap-3 p-2.5">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </li>
              ))
            ) : filtered.length === 0 ? (
              <li className="p-4 text-center text-sm text-bb-muted">{q ? 'No conversation matches your search.' : 'No conversations yet.'}</li>
            ) : (
              filtered.map((c) => {
                const title = c.campaign?.title ?? 'Conversation'
                const isActive = location.pathname === `/messages/${c.id}`
                const time = formatTime((c as any).last_message_at ?? c.updated_at ?? null)
                const unread = Number((c as any).unread_count ?? 0)
                const preview = ((c as any).last_message_body ?? '').trim()
                const closed = c.status === 'closed'

                return (
                  <li key={c.id}>
                    <NavLink
                      to={`/messages/${c.id}`}
                      className={`flex items-start gap-3 rounded-[10px] p-2.5 transition-colors ${isActive ? 'bg-bb-primary-soft' : 'hover:bg-bb-subtle'}`}
                    >
                      <span className="bb-avatar h-9 w-9 text-sm">{title.trim().slice(0, 1).toUpperCase() || 'C'}</span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline justify-between gap-2">
                          <span className={`truncate text-sm ${unread > 0 ? 'font-semibold' : 'font-medium'}`}>{title}</span>
                          <span className="shrink-0 text-[11px] text-bb-muted">{time}</span>
                        </span>
                        <span className="mt-0.5 flex items-center justify-between gap-2">
                          <span className={`truncate text-xs ${unread > 0 ? 'text-bb-text' : 'text-bb-muted'}`}>
                            {preview || (closed ? 'This conversation is closed.' : 'No messages yet.')}
                          </span>
                          {unread > 0 ? <span className="bb-count shrink-0">{unread > 99 ? '99+' : unread}</span> : closed ? <span className="bb-badge shrink-0 text-[10px]">Closed</span> : null}
                        </span>
                      </span>
                    </NavLink>
                  </li>
                )
              })
            )}
          </ul>
        </aside>

        {/* Thread */}
        <section className={`min-h-0 min-w-0 flex-col lg:flex ${inThread ? 'flex' : 'hidden'}`}>
          {inThread ? (
            <Outlet />
          ) : (
            <div className="grid h-full place-items-center p-10 text-center">
              <div className="flex max-w-xs flex-col items-center">
                <span className="bb-stat-icon">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </span>
                <p className="mt-3 font-medium">Select a conversation</p>
                <p className="mt-1 text-sm text-bb-muted">Pick a thread on the left to read it and reply.</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
