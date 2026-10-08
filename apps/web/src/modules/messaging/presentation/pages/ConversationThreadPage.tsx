import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeftIcon, LockClosedIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/modules/auth/application/context'
import { useProfile } from '@/modules/profile/application/hooks/useProfile'
import { useConversationThread } from '@/modules/messaging/application/hooks'
import { Skeleton } from '@/shared/components/ui'

function formatDateTime(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
}

export default function ConversationThreadPage() {
  const { id } = useParams()
  const { loading, sending, error, conversation, messages, send, listRef, title } = useConversationThread(id)
  const [draft, setDraft] = useState('')

  const auth = useAuth() as any
  const { profile } = useProfile() as any
  const myId = useMemo(() => {
    const v = profile?.id ?? auth.user?.id ?? auth.user?.data?.id ?? localStorage.getItem('bb_user_id')
    return v ? String(v) : ''
  }, [profile?.id, auth.user])

  const isClosed = conversation?.status === 'closed'
  const canSend = !!draft.trim() && !isClosed

  function onSend() {
    const v = draft.trim()
    if (!v) return
    if (isClosed) return
    void send(v)
    setDraft('')
  }

  const items = useMemo(() => {
    const raw = messages?.data ?? []
    return raw.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }, [messages])

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-bb-border/10 px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/messages" className="bb-icon-btn h-8 w-8 lg:hidden" aria-label="Back to conversations">
            <ArrowLeftIcon className="h-[18px] w-[18px]" />
          </Link>
          <span className="bb-avatar h-9 w-9 text-sm">{(title ?? '').trim().slice(0, 1).toUpperCase() || 'C'}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{title}</p>
            <p className="text-xs text-bb-muted">{isClosed ? 'Read-only' : 'Brand and creator'}</p>
          </div>
        </div>
        {conversation ? (
          isClosed ? (
            <span className="bb-badge gap-1">
              <LockClosedIcon className="h-3.5 w-3.5" />
              Closed
            </span>
          ) : (
            <span className="bb-badge bb-badge-green">Active</span>
          )
        ) : null}
      </div>

      {/* Messages */}
      <div ref={listRef} className="bb-soft-scroll min-h-0 flex-1 overflow-auto px-4 py-5">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2.5">
          {error ? (
            <div className="rounded-[10px] bg-bb-accent-soft p-3 text-sm text-bb-accent-strong">{error}</div>
          ) : loading ? (
            <>
              <Skeleton className="h-12 w-1/2" />
              <Skeleton className="ml-auto h-12 w-2/5" />
              <Skeleton className="h-16 w-3/5" />
            </>
          ) : items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-medium">No messages yet</p>
              <p className="mt-1 text-sm text-bb-muted">Send the first message below.</p>
            </div>
          ) : (
            items.map((m) => {
              const mine = myId ? String(m.sender_id) === myId : false
              return (
                <div key={m.id} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`max-w-[78%] whitespace-pre-wrap rounded-[14px] px-3.5 py-2 text-sm leading-relaxed ${
                      mine ? 'rounded-br-[4px] bg-bb-primary text-white dark:text-bb-bg' : 'rounded-bl-[4px] bg-bb-subtle text-bb-text'
                    }`}
                  >
                    {m.body}
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-bb-muted">{formatDateTime(m.created_at)}</span>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 border-t border-bb-border/10 p-3">
        {isClosed ? (
          <p className="py-2 text-center text-sm text-bb-muted">This conversation is closed. You can still read it.</p>
        ) : (
          <form
            className="flex items-end gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (canSend) onSend()
            }}
          >
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={1}
              placeholder="Write a message"
              aria-label="Message"
              className="bb-input bb-soft-scroll max-h-40 min-h-[40px] flex-1 resize-none"
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (canSend) onSend()
                }
              }}
            />
            <button type="submit" className="bb-btn-primary w-10 px-0" aria-label="Send" disabled={!canSend || sending}>
              <PaperAirplaneIcon className="h-[18px] w-[18px]" />
            </button>
          </form>
        )}
        {!isClosed ? <p className="mt-1.5 px-1 text-[11px] text-bb-muted">Enter to send, Shift + Enter for a new line</p> : null}
      </div>
    </div>
  )
}
