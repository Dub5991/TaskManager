import { useState } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const addNotification = (msg: string) => setNotifications(n => [...n, msg]);
  const clearNotifications = () => setNotifications([]);
  return { notifications, addNotification, clearNotifications };
};