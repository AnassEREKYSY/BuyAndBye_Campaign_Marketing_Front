import { useAuth } from '@/modules/auth/application/context'
import { httpClient } from '@/shared/api/http'
import { NotificationApiClient, type InboxNotification, type Paginated } from '@/shared/api/notifications'
import { InboxNotificationsContext } from './InboxNotificationsContext'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export function InboxNotificationsProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  const isLoggedIn = auth.isAuthenticated

  const api = useMemo(() => new NotificationApiClient(httpClient as any), [])
  const [unreadCount, setUnreadCount] = useState(0)
  const [latest, setLatest] = useState<InboxNotification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const pollingRef = useRef<number | null>(null)

  const list = useCallback(
    async (params?: { page?: number; size?: number; unread?: boolean }): Promise<Paginated<InboxNotification>> => {
      return api.list(params)
    },
    [api],
  )

  const refresh = useCallback(async () => {
    if (!isLoggedIn) return
    setIsLoading(true)
    try {
      const [count, page] = await Promise.all([api.unreadCount(), api.list({ page: 1, size: 7, unread: false })])
      setUnreadCount(count)
      setLatest(page.data ?? [])
    } finally {
      setIsLoading(false)
    }
  }, [api, isLoggedIn])

  const markRead = useCallback(
    async (id: string) => {
      if (!isLoggedIn) return
      await api.markRead(id)
      await refresh()
    },
    [api, isLoggedIn, refresh],
  )

  const markAllRead = useCallback(async () => {
    if (!isLoggedIn) return
    await api.markAllRead()
    await refresh()
  }, [api, isLoggedIn, refresh])

  const remove = useCallback(
    async (id: string) => {
      if (!isLoggedIn) return
      await api.remove(id)
      setLatest((prev) => prev.filter((n) => n.id !== id))
      await refresh()
    },
    [api, isLoggedIn, refresh],
  )

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((v) => !v), [])

  useEffect(() => {
    if (!isLoggedIn) {
      setUnreadCount(0)
      setLatest([])
      setIsOpen(false)
      return
    }
    void refresh()
  }, [isLoggedIn, refresh])

  useEffect(() => {
    if (!isLoggedIn) return
    if (pollingRef.current) window.clearInterval(pollingRef.current)

    pollingRef.current = window.setInterval(() => {
      void refresh()
    }, 25000)

    return () => {
      if (pollingRef.current) window.clearInterval(pollingRef.current)
      pollingRef.current = null
    }
  }, [isLoggedIn, refresh])

  const value = useMemo(
    () => ({
      unreadCount,
      latest,
      isOpen,
      isLoading,
      open,
      close,
      toggle,
      refresh,
      markRead,
      markAllRead,
      remove,
      list,
    }),
    [unreadCount, latest, isOpen, isLoading, open, close, toggle, refresh, markRead, markAllRead, remove, list],
  )

  return <InboxNotificationsContext.Provider value={value}>{children}</InboxNotificationsContext.Provider>
}