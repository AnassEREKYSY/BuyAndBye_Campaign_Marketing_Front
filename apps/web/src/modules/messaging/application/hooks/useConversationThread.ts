import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Conversation, Message, Paginated } from '@core/modules/messaging'
import { GetConversationUseCase, ListMessagesUseCase, MarkReadUseCase, SendMessageUseCase } from '@core/modules/messaging'
import { messagingContainer } from '@/shared/api/messagingContainer'

export function useConversationThread(conversationId?: string) {
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Paginated<Message> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const listRef = useRef<HTMLDivElement | null>(null)

  const load = useCallback(async () => {
    if (!conversationId) return
    setLoading(true)
    setError(null)
    try {
      const getUc = new GetConversationUseCase(messagingContainer.messagingRepository)
      const listUc = new ListMessagesUseCase(messagingContainer.messagingRepository)
      const markUc = new MarkReadUseCase(messagingContainer.messagingRepository)

      const c = await getUc.execute(conversationId)
      const m = await listUc.execute(conversationId, 1, 50)

      setConversation(c)
      setMessages(m)

      void markUc.execute(conversationId)

      requestAnimationFrame(() => {
        const el = listRef.current
        if (!el) return
        el.scrollTop = el.scrollHeight
      })
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }, [conversationId])

  useEffect(() => {
    void load()
  }, [load])

  const send = useCallback(async (body: string) => {
    if (!conversationId) return
    const v = body.trim()
    if (!v) return

    setSending(true)
    setError(null)
    try {
      const sendUc = new SendMessageUseCase(messagingContainer.messagingRepository)
      const msg = await sendUc.execute(conversationId, { body: v })

      setMessages((prev) => {
        const current = prev?.data ?? []
        const meta = prev?.meta ?? { current_page: 1, per_page: 50, total: current.length, last_page: 1 }
        return {
          data: [...current, msg],
          meta: { ...meta, total: meta.total + 1 },
        } as any
      })

      requestAnimationFrame(() => {
        const el = listRef.current
        if (!el) return
        el.scrollTop = el.scrollHeight
      })
    } catch (e: any) {
      setError(e?.message ?? 'Failed to send message')
    } finally {
      setSending(false)
    }
  }, [conversationId])

  const title = useMemo(() => conversation?.campaign?.title ?? 'Conversation', [conversation])

  return { loading, sending, error, conversation, messages, send, listRef, title, reload: load }
}