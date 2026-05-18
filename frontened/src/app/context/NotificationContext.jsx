import { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 'initial-1', text: 'Welcome to MT Management CRM!', time: 'Just now', unread: true, path: '/' }
  ]);

  const addNotification = useCallback((notification) => {
    console.log("NotificationContext: addNotification called with", notification);
    const newNotification = {
      id: Date.now().toString(),
      unread: true,
      time: 'Just now',
      ...notification
    };
    
    setNotifications(prev => {
      console.log("NotificationContext: Updating state with new notification");
      return [newNotification, ...prev];
    });
    
    // Trigger visual toast
    toast.success(newNotification.text, {
      description: newNotification.time,
    });
  }, []);

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, unread: false } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      addNotification, 
      markAsRead, 
      markAllAsRead,
      clearNotifications,
      unreadCount: notifications.filter(n => n.unread).length
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
