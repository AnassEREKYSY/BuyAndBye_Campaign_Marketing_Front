import { createContext, useContext } from 'react'
import { NotificationType, NotificationOptions } from '@buyandbye/core'

export type NotificationPayload = {
  type: NotificationType
  message: string
  options?: NotificationOptions
}

export interface NotificationContextValue {
  current: NotificationPayload | null
  showNotification: (type: NotificationType, message: string, options?: NotificationOptions) => void
  success: (message: string, options?: NotificationOptions) => void
  error: (message: string, options?: NotificationOptions) => void
  warning: (message: string, options?: NotificationOptions) => void
  info: (message: string, options?: NotificationOptions) => void
}

export const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotification must be used within NotificationProvider')
  return context
}