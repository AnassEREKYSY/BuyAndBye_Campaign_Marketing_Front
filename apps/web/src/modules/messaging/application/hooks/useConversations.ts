import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Conversation, Paginated } from '@core/modules/messaging'
import { ListConversationsUseCase } from '@core/modules/messaging'
import { messagingContainer } from '@/shared/api/messagingContainer'

export function useConversations() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Paginated<Conversation> | null>(null)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async (page = 1, size = 20) => {
    setLoading(true)
    setError(null)
    try {
      const uc = new ListConversationsUseCase(messagingContainer.messagingRepository)
      const res = await uc.execute(page, size)
      setData(res)
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh(1, 20)
  }, [refresh])

  const unreadCount = useMemo(() => {
    if (!data?.data?.length) return 0
    return data.data.reduce((sum, c) => sum + ((c as any).unread ?? 0), 0)
  }, [data])

  return { loading, data, error, refresh, unreadCount }
}