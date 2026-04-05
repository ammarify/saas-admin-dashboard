import { useEffect, useMemo, useState } from 'react';
import { NotificationsContext } from './notificationsContext';

const STORAGE_KEY = 'dashboard_notifications';
const MAX_NOTIFICATIONS = 12;

function readStoredNotifications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(readStoredNotifications);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((item) => item.unread).length,
      addNotification: ({ title, detail }) => {
        setNotifications((prev) => [
          {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            title,
            detail,
            createdAt: Date.now(),
            unread: true,
          },
          ...prev,
        ].slice(0, MAX_NOTIFICATIONS));
      },
      markAllAsRead: () => {
        setNotifications((prev) => prev.map((item) => (item.unread ? { ...item, unread: false } : item)));
      },
    }),
    [notifications]
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export default NotificationsProvider;
