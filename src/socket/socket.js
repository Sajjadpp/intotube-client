import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  // Disconnect existing socket if any
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socket = io("http://10.150.120.181:4000", {
    query: { userId },
    transports: ['websocket'],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  // Connection logging
  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("connect_error", (err) => {
    console.error("Connection Error:", err);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};