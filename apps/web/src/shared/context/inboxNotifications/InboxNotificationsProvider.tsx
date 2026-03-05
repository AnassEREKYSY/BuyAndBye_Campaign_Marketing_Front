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
  const inFlightRef = useRef(false)

  const list = useCallback(
    async (params?: { page?: number; size?: number; unread?: boolean }): Promise<Paginated<InboxNotification>> => {
      return api.list(params)
    },
    [api],
  )

  const refresh = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!isLoggedIn) return
      if (inFlightRef.current) return
      inFlightRef.current = true

      const silent = !!opts?.silent

      if (!silent) setIsLoading(true)

      try {
        const [count, page] = await Promise.all([api.unreadCount(), api.list({ page: 1, size: 7, unread: false })])
        setUnreadCount(count)
        setLatest(page.data ?? [])
      } finally {
        if (!silent) setIsLoading(false)
        inFlightRef.current = false
      }
    },
    [api, isLoggedIn],
  )

  const markRead = useCallback(
    async (id: string) => {
      if (!isLoggedIn) return

      setLatest((prev) => prev.map((n) => (n.id === id ? { ...n, read_at: n.read_at ?? new Date().toISOString() } : n)))
      setUnreadCount((c) => Math.max(0, c - 1))

      try {
        await api.markRead(id)
      } finally {
        void refresh({ silent: true })
      }
    },
    [api, isLoggedIn, refresh],
  )

  const markAllRead = useCallback(async () => {
    if (!isLoggedIn) return

    setLatest((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
    setUnreadCount(0)

    try {
      await api.markAllRead()
    } finally {
      void refresh({ silent: true })
    }
  }, [api, isLoggedIn, refresh])

  const remove = useCallback(
    async (id: string) => {
      if (!isLoggedIn) return

      setLatest((prev) => {
        const removed = prev.find((x) => x.id === id)
        if (removed && !removed.read_at) setUnreadCount((c) => Math.max(0, c - 1))
        return prev.filter((n) => n.id !== id)
      })

      try {
        await api.remove(id)
      } finally {
        void refresh({ silent: true })
      }
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
      setIsLoading(false)
      return
    }
    void refresh({ silent: false })
  }, [isLoggedIn, refresh])

  useEffect(() => {
    if (!isLoggedIn) return
    if (pollingRef.current) window.clearInterval(pollingRef.current)

    pollingRef.current = window.setInterval(() => {
      void refresh({ silent: true })
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