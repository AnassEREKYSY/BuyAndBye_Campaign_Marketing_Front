import { useInboxNotifications } from '@/shared/context/inboxNotifications'

export function useInbox() {
  return useInboxNotifications()
}