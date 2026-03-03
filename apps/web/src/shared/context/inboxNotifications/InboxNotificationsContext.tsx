import { createContext, useContext } from 'react'
import type { InboxNotification, Paginated } from '@/shared/api/notifications'

type Ctx = {
  unreadCount: number
  latest: InboxNotification[]
  isOpen: boolean
  isLoading: boolean
  dismissedIds: Set<string>
  open: () => void
  close: () => void
  toggle: () => void
  refresh: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  remove: (id: string) => Promise<void>
  dismissLocal: (id: string) => void
  clearDismissed: () => void
  list: (params?: { page?: number; size?: number; unread?: boolean }) => Promise<Paginated<InboxNotification>>
}

export const InboxNotificationsContext = createContext<Ctx | null>(null)

export function useInboxNotifications() {
  const ctx = useContext(InboxNotificationsContext)
  if (!ctx) throw new Error('InboxNotificationsProvider missing')
  return ctx
}