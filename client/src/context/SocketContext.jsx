import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Only connect if user is logged in
    if (user) {
      const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');
      setSocket(newSocket);

      // Join user room
      newSocket.emit('join', user._id || user.id);

      // Join admin room if admin
      if (user.isAdmin) {
        newSocket.emit('joinAdmin');
      }

      // Listen for order status updates
      newSocket.on('orderStatusUpdated', (data) => {
        addNotification({
          id: Date.now(),
          type: 'info',
          title: 'Order Update',
          message: data.message,
          orderId: data.orderId
        });
      });

      // Listen for new orders (for admins)
      newSocket.on('newOrder', (data) => {
        addNotification({
          id: Date.now(),
          type: 'success',
          title: 'New Order!',
          message: data.message,
          orderId: data.orderId
        });
      });

      return () => {
        newSocket.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const addNotification = (notif) => {
    setNotifications((prev) => [notif, ...prev]);
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(notif.id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <SocketContext.Provider value={{ socket, notifications, removeNotification }}>
      {children}
    </SocketContext.Provider>
  );
};
