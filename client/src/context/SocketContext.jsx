import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [roomCode, setRoomCode] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [hostSocketId, setHostSocketId] = useState(null);

  useEffect(() => {
    // Connect to server (using empty URL since Vite proxy forwards '/socket.io' correctly to port 5000)
    // Note: Socket.io uses '/socket.io/' path by default. Our Vite proxy will route it if set up.
    // Wait! Let's check if the server is on port 5000. In development, we can connect directly to http://localhost:5000
    // so we don't have to worry about socket proxying issues in some Vite versions.
    const BACKEND_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? window.location.origin : 'http://localhost:5000');
    const socketInstance = io(BACKEND_URL, {
      autoConnect: true,
      transports: ['websocket']
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('[Socket] Connected to server');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setRoomCode(null);
      setUsers([]);
      setMessages([]);
      setHostSocketId(null);
      console.log('[Socket] Disconnected from server');
    });

    // Event listeners
    socketInstance.on('room:joined', ({ roomCode: joinedCode, users: initialUsers, hostSocketId: hostId }) => {
      setRoomCode(joinedCode);
      setUsers(initialUsers);
      setHostSocketId(hostId);
      setMessages([]);
    });

    socketInstance.on('peer:joined', ({ username, users: updatedUsers }) => {
      setUsers(updatedUsers);
      // Dispatch system chat message
      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          username: 'SYSTEM',
          text: `${username} joined the workspace chamber.`,
          timestamp: new Date(),
          isSystem: true
        }
      ]);
    });

    socketInstance.on('peer:left', ({ username, users: updatedUsers }) => {
      setUsers(updatedUsers);
      // Dispatch system chat message
      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          username: 'SYSTEM',
          text: `${username} left the workspace chamber.`,
          timestamp: new Date(),
          isSystem: true
        }
      ]);
    });

    socketInstance.on('chat:message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const createRoom = (username) => {
    if (socket) {
      socket.emit('room:create', { username });
    }
  };

  const joinRoom = (code, username) => {
    if (socket) {
      socket.emit('room:join', { roomCode: code, username });
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('room:leave');
      setRoomCode(null);
      setUsers([]);
      setMessages([]);
      setHostSocketId(null);
    }
  };

  const sendChatMessage = (text) => {
    if (socket && roomCode) {
      socket.emit('chat:send', { text });
    }
  };

  const syncPhysicsState = (physicsData) => {
    if (socket && roomCode) {
      socket.emit('physics:sync', physicsData);
    }
  };

  const sendPhysicsAction = (actionType, data) => {
    if (socket && roomCode) {
      socket.emit('physics:action', { actionType, data });
    }
  };

  const isHost = socket ? socket.id === hostSocketId : false;

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      roomCode,
      users,
      messages,
      isHost,
      createRoom,
      joinRoom,
      leaveRoom,
      sendChatMessage,
      syncPhysicsState,
      sendPhysicsAction
    }}>
      {children}
    </SocketContext.Provider>
  );
};
