import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PaperAirplaneIcon, LockClosedIcon } from '@heroicons/react/24/outline'
import { useConversationThread } from '@/modules/messaging/application/hooks'

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(' ')
}

function formatDateTime(iso?: string | null) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' })
}

function bubbleStyle(kind: 'me' | 'them') {
  if (kind === 'me') {
    return {
      border: '1px solid rgb(16 185 129 / 0.24)',
      background: 'linear-gradient(180deg, rgb(16 185 129 / 0.22), rgb(16 185 129 / 0.12))',
    }
  }

  return {
    border: '1px solid rgb(var(--bb-border) / 0.10)',
    background: 'rgb(var(--bb-surface) / 0.92)',
  }
}

export default function ConversationThreadPage() {
  const { id } = useParams()
  const { loading, sending, error, conversation, messages, send, listRef, title } = useConversationThread(id)
  const [draft, setDraft] = useState('')

  const myId = useMemo(() => {
    const v = localStorage.getItem('bb_user_id')
    return v ? String(v) : ''
  }, [])

  const isClosed = conversation?.status === 'closed'

  const subtitle = useMemo(() => {
    if (!conversation) return 'Brand ↔ Influencer'
    return isClosed ? 'Archived • Read-only' : 'Brand ↔ Influencer • Live chat'
  }, [conversation, isClosed])

  const canSend = useMemo(() => {
    if (!draft.trim()) return false
    if (isClosed) return false
    return true
  }, [draft, isClosed])

  function onSend() {
    const v = draft.trim()
    if (!v) return
    if (isClosed) return
    void send(v)
    setDraft('')
  }

  const items = useMemo(() => {
    const raw = messages?.data ?? []
    return raw
      .slice()
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }, [messages])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="shrink-0 border-b p-4" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
              {title}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'rgb(var(--bb-text) / 0.55)' }}>
              {subtitle}
            </p>
          </div>

          {isClosed ? (
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-semibold"
              style={{ borderColor: 'rgb(var(--bb-border) / 0.12)', color: 'rgb(var(--bb-text) / 0.65)' }}
            >
              <LockClosedIcon className="h-4 w-4" />
              Closed
            </span>
          ) : (
            <span
              className="rounded-full border px-3 py-1 text-[11px] font-semibold"
              style={{ borderColor: 'rgb(var(--bb-border) / 0.12)', color: 'rgb(var(--bb-text) / 0.65)' }}
            >
              Active
            </span>
          )}
        </div>
      </div>

      <div
        ref={listRef}
        className="bb-soft-scroll flex-1 overflow-auto p-4"
        style={{
          background:
            'radial-gradient(1200px 700px at 50% 10%, rgb(var(--bb-primary) / 0.10), transparent 55%), radial-gradient(1200px 700px at 40% 40%, rgb(var(--bb-accent) / 0.08), transparent 60%)',
        }}
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
          {error ? (
            <div className="rounded-3xl border p-4 text-sm" style={{ borderColor: 'rgb(var(--bb-border) / 0.12)', color: 'rgb(var(--bb-text) / 0.75)' }}>
              {error}
            </div>
          ) : loading ? (
            <div className="rounded-3xl border p-4 text-sm" style={{ borderColor: 'rgb(var(--bb-border) / 0.12)', color: 'rgb(var(--bb-text) / 0.75)' }}>
              Loading messages...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border p-6 text-center" style={{ borderColor: 'rgb(var(--bb-border) / 0.12)' }}>
              <p className="text-sm font-extrabold" style={{ color: 'rgb(var(--bb-text) / 0.90)' }}>
                No messages yet
              </p>
              <p className="mt-2 text-sm" style={{ color: 'rgb(var(--bb-text) / 0.65)' }}>
                Start the conversation by sending a message.
              </p>
            </div>
          ) : (
            items.map((m) => {
              const mine = myId ? String(m.sender_id) === myId : false
              const alignClass = mine ? 'justify-end' : 'justify-start'
              const bubbleKind = mine ? 'me' : 'them'

              return (
                <div key={m.id} className={cx('flex', alignClass)}>
                  <div className="max-w-[78%] rounded-2xl px-4 py-2.5 shadow-sm" style={bubbleStyle(bubbleKind)}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'rgb(var(--bb-text) / 0.92)' }}>
                      {m.body}
                    </p>
                    <p className={cx('mt-1 text-[11px]', mine ? 'text-right' : 'text-left')} style={{ color: 'rgb(var(--bb-text) / 0.55)' }}>
                      {formatDateTime(m.created_at)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div className="h-2" />
        </div>
      </div>

      <div className="shrink-0 border-t p-4" style={{ borderColor: 'rgb(var(--bb-border) / 0.10)' }}>
        <div className="mx-auto flex w-full max-w-3xl items-end gap-2">
          <div className="flex-1">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={1}
              placeholder={isClosed ? 'This conversation is closed.' : 'Write a message...'}
              className="min-h-[44px] w-full resize-none rounded-2xl border bg-transparent px-4 py-3 text-sm outline-none disabled:opacity-60"
              style={{ borderColor: 'rgb(var(--bb-border) / 0.12)', color: 'rgb(var(--bb-text) / 0.92)' }}
              disabled={isClosed || loading}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (canSend) onSend()
                }
              }}
            />
            <p className="mt-2 text-[11px]" style={{ color: 'rgb(var(--bb-text) / 0.55)' }}>
              Enter to send • Shift+Enter for a new line
            </p>
          </div>

          <button
            type="button"
            onClick={onSend}
            className="bb-nav-cta grid h-11 w-11 place-items-center rounded-2xl disabled:opacity-60"
            aria-label="Send"
            disabled={!canSend || sending}
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}