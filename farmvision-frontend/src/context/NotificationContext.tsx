import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

export interface NotificationContextType {
  notifications: NotificationItem[];
  showNotification: (type: NotificationType, message: string, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showNotification = useCallback(
    (type: NotificationType, message: string, duration = 4000) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
      const newItem: NotificationItem = { id, type, message, duration };

      setNotifications((prev) => [...prev, newItem]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  const success = useCallback(
    (message: string, duration = 4000) => showNotification('success', message, duration),
    [showNotification]
  );

  const error = useCallback(
    (message: string, duration = 4500) => showNotification('error', message, duration),
    [showNotification]
  );

  const warning = useCallback(
    (message: string, duration = 4000) => showNotification('warning', message, duration),
    [showNotification]
  );

  const info = useCallback(
    (message: string, duration = 3500) => showNotification('info', message, duration),
    [showNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        showNotification,
        success,
        error,
        warning,
        info,
        removeNotification,
      }}
    >
      {children}
      {/* Toast Overlay Container */}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {notifications.map((n) => {
          const Icon =
            n.type === 'success'
              ? CheckCircle2
              : n.type === 'error'
              ? AlertCircle
              : n.type === 'warning'
              ? AlertTriangle
              : Info;

          return (
            <div key={n.id} className={`toast-item toast-${n.type}`} role="alert">
              <div className="toast-icon">
                <Icon size={20} />
              </div>
              <div className="toast-message">{n.message}</div>
              <button
                type="button"
                className="toast-close"
                onClick={() => removeNotification(n.id)}
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;
