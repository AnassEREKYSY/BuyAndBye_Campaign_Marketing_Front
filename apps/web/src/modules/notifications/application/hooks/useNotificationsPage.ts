import { useMemo, useState } from 'react'
import { useInboxNotifications } from '@/shared/context/inboxNotifications'

export function useNotificationsPage() {
  const inbox = useInboxNotifications()
  const [page, setPage] = useState(1)
  const [onlyUnread, setOnlyUnread] = useState(false)

  const actions = useMemo(
    () => ({
      setPage,
      prevPage: () => setPage((p) => Math.max(1, p - 1)),
      nextPage: () => setPage((p) => p + 1),
      toggleOnlyUnread: () => setOnlyUnread((v) => !v),
      markAllRead: inbox.markAllRead,
      clearHidden: inbox.clearDismissed,
      markRead: inbox.markRead,
      hide: inbox.dismissLocal,
    }),
    [inbox],
  )

  const state = useMemo(
    () => ({
      page,
      onlyUnread,
      unreadCount: inbox.unreadCount,
      dismissedIds: inbox.dismissedIds,
    }),
    [page, onlyUnread, inbox.unreadCount, inbox.dismissedIds],
  )

  return { inbox, state, actions }
}