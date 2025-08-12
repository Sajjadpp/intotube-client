import { createContext, useState, useEffect, useContext, useCallback } from "react";
import { connectSocket, disconnectSocket } from "../socket/socket";
import { useAuth } from "./AuthContext";
import axiosInstance from "../axios/AxiosInstance";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newNotification, setNewNotification] = useState(null);
  const { user } = useAuth();

  const fetchNotifications = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/channel/notifications/${user._id}`);
      const fetchedNotifications = response.data || [];
      setNotifications(fetchedNotifications);
      setUnreadCount(fetchedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  }, [user?._id]);

  useEffect(() => {
    if (!user?._id) return;

    fetchNotifications();

    const socket = connectSocket(user._id);

    const handleNewNotification = (notif) => {
      console.log('Received new notification:', notif);
      setNewNotification(notif);
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    const handleSampleMessage = (message) => {
      console.log('Received sample message:', message);
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("sample", handleSampleMessage);

    return () => {
      socket.off("newNotification", handleNewNotification);
      socket.off("sample", handleSampleMessage);
      disconnectSocket();
    };
  }, [user?._id, fetchNotifications]);

  const markAllRead = async () => {
    try {
      await axiosInstance.patch(`/channel/notifications/mark-read/${user._id}`);
      setUnreadCount(0);
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAllRead,
        newNotification,
        setNewNotification,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);