import { useCallback, useMemo, useState } from 'react'
import { NotificationContext, NotificationContextValue, NotificationPayload } from './NotificationContext'
import { NotificationOptions, NotificationType } from '@buyandbye/core'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<NotificationPayload | null>(null)

  const showNotification = useCallback((type: NotificationType, message: string, options?: NotificationOptions) => {
    setCurrent({ type, message, options })

    const duration = options?.duration ?? 2800
    window.setTimeout(() => {
      setCurrent((c) => (c?.message === message ? null : c))
    }, duration)
  }, [])

  const value: NotificationContextValue = useMemo(
    () => ({
      current,
      showNotification,
      success: (message, options) => showNotification('success', message, options),
      error: (message, options) => showNotification('error', message, options),
      warning: (message, options) => showNotification('warning', message, options),
      info: (message, options) => showNotification('info', message, options),
    }),
    [current, showNotification],
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}