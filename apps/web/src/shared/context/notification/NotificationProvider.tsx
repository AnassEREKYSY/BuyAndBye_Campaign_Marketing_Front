import { ReactNode, useState, useCallback } from 'react';
import { NotificationContext } from './NotificationContext';
import { Notification, NotificationType, NotificationOptions } from '@buyandbye/core';
import { Snackbar } from '@/shared/components/Snackbar';

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (type: NotificationType, message: string, options?: NotificationOptions) => {
      const id = `notification-${Date.now()}-${Math.random()}`;
      const notification: Notification = {
        id,
        type,
        message,
        duration: options?.duration ?? 5000,
      };

      setNotifications((prev) => [...prev, notification]);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const success = useCallback(
    (message: string, options?: NotificationOptions) => {
      showNotification('success', message, options);
    },
    [showNotification]
  );

  const error = useCallback(
    (message: string, options?: NotificationOptions) => {
      showNotification('error', message, options);
    },
    [showNotification]
  );

  const warning = useCallback(
    (message: string, options?: NotificationOptions) => {
      showNotification('warning', message, options);
    },
    [showNotification]
  );

  const info = useCallback(
    (message: string, options?: NotificationOptions) => {
      showNotification('info', message, options);
    },
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        success,
        error,
        warning,
        info,
      }}
    >
      {children}
      <div style={{ position: 'fixed', top: '1rem', right: '1rem', zIndex: 9999 }}>
        {notifications.map((notification) => (
          <Snackbar
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};
