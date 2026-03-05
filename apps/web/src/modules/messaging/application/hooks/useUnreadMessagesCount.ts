import { useCallback, useEffect, useRef, useState } from 'react'
import { messagingContainer } from '@/shared/api/messagingContainer'

export function useUnreadMessagesCount(enabled: boolean) {
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(false)
  const timerRef = useRef<number | null>(null)

  const refresh = useCallback(async () => {
    if (!enabled) return
    setLoading(true)
    try {
      const res = await messagingContainer.messagingRepository.unreadCount()
      setUnread(Number(res?.unread ?? 0))
    } catch {
      // keep last value
    } finally {
      setLoading(false)
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) {
      setUnread(0)
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
      return
    }

    void refresh()

    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = window.setInterval(() => {
      void refresh()
    }, 6000)

    function onFocus() {
      void refresh()
    }
    function onVisibility() {
      if (document.visibilityState === 'visible') void refresh()
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [enabled, refresh])

  return { unread, loading, refresh }
}