import { useCallback, useEffect, useState } from 'react';
import { AppNotification, fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../services/api';

const POLL_MS = 60_000;

/**
 * The signed-in visitor's notifications from the API (offers today; more kinds later).
 * Polls every minute and when the tab comes back into view. Signed out — or an API without the endpoint — means an empty list.
 */
export function useNotifications(signedIn: boolean) {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(() => {
    if (!signedIn) return;
    fetchNotifications()
      .then((r) => {
        setItems(r.items);
        setUnread(r.unreadCount);
      })
      .catch(() => undefined);
  }, [signedIn]);

  useEffect(() => {
    if (!signedIn) {
      setItems([]);
      setUnread(0);
      return;
    }
    load();
    const timer = window.setInterval(load, POLL_MS);
    const onVisible = () => document.visibilityState === 'visible' && load();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [signedIn, load]);

  const markRead = (id: number) => {
    setItems((list) => list.map((n) => (n.id === id && !n.isRead ? { ...n, isRead: true } : n)));
    setUnread((u) => Math.max(0, u - (items.some((n) => n.id === id && !n.isRead) ? 1 : 0)));
    markNotificationRead(id).catch(() => undefined);
  };

  const markAllRead = () => {
    setItems((list) => list.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
    markAllNotificationsRead().catch(() => undefined);
  };

  return { items, unread, markRead, markAllRead, reload: load };
}
