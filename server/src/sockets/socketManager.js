// Real-time collaborative room socket coordinator

// Standard 6-character uppercase alphanumeric room code generator (excluding confusing chars like O/0/I/1)
const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// In-memory registry of active classroom rooms
const rooms = new Map();

export const initSockets = (io) => {
  io.on('connection', (socket) => {
    let currentRoomCode = null;
    let currentUsername = null;

    console.log(`[Socket Connected]: Socket ID ${socket.id}`);

    // Helper to leave a room cleanly
    const handleLeaveRoom = () => {
      if (!currentRoomCode) return;

      const room = rooms.get(currentRoomCode);
      if (room) {
        // Remove user from registry
        room.users = room.users.filter(u => u.socketId !== socket.id);
        console.log(`[Socket Leave]: ${currentUsername} left room ${currentRoomCode}`);

        if (room.users.length === 0) {
          // If last user leaves, dismantle the room to free memory
          rooms.delete(currentRoomCode);
          console.log(`[Room Terminated]: Room ${currentRoomCode} is now empty and has been removed`);
        } else {
          // Notify remaining classmates
          io.to(`room:${currentRoomCode}`).emit('peer:left', {
            username: currentUsername,
            users: room.users
          });
        }
      }

      socket.leave(`room:${currentRoomCode}`);
      currentRoomCode = null;
    };

    // Event: Create new room
    socket.on('room:create', ({ username }) => {
      try {
        const roomCode = generateRoomCode();
        currentRoomCode = roomCode;
        currentUsername = username;

        // Initialize room registry object
        const newRoom = {
          roomCode,
          hostSocketId: socket.id,
          users: [{ socketId: socket.id, username, joinedAt: new Date() }],
          activeExperiment: null
        };
        rooms.set(roomCode, newRoom);

        socket.join(`room:${roomCode}`);
        console.log(`[Room Created]: Room ${roomCode} initialized by host ${username}`);

        socket.emit('room:joined', {
          roomCode,
          users: newRoom.users,
          hostSocketId: socket.id
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to create room' });
      }
    });

    // Event: Join existing room
    socket.on('room:join', ({ roomCode, username }) => {
      try {
        const code = roomCode.trim().toUpperCase();
        const room = rooms.get(code);

        if (!room) {
          socket.emit('error', { message: 'Laboratory room not found. Check code.' });
          return;
        }

        // Prevent username collision inside the same room
        const userExists = room.users.some(u => u.username.toLowerCase() === username.toLowerCase());
        const adjustedUsername = userExists ? `${username}_${Math.floor(100 + Math.random() * 900)}` : username;

        currentRoomCode = code;
        currentUsername = adjustedUsername;

        // Add user to room users array
        const newUser = { socketId: socket.id, username: adjustedUsername, joinedAt: new Date() };
        room.users.push(newUser);

        socket.join(`room:${code}`);
        console.log(`[Room Joined]: ${adjustedUsername} entered Room ${code}`);

        // Notify client who joined
        socket.emit('room:joined', {
          roomCode: code,
          users: room.users,
          hostSocketId: room.hostSocketId
        });

        // Notify other room occupants
        socket.to(`room:${code}`).emit('peer:joined', {
          username: adjustedUsername,
          users: room.users
        });
      } catch (err) {
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Event: High-Frequency Physics Coordinate Sync (dispatched by room Host)
    socket.on('physics:sync', (physicsData) => {
      if (!currentRoomCode) return;
      // Forward vector layout coordinates directly to classmates (skips sender)
      socket.to(`room:${currentRoomCode}`).emit('physics:sync', physicsData);
    });

    // Event: Action Sync (Spawning shapes, deletions, updates, resets)
    socket.on('physics:action', (actionPayload) => {
      if (!currentRoomCode) return;
      // Broadcast action to other classmates
      socket.to(`room:${currentRoomCode}`).emit('physics:action', actionPayload);
    });

    // Event: Ping heartbeat to measure RTT latency
    socket.on('ping:send', ({ timestamp }) => {
      socket.emit('ping:reply', { timestamp });
    });

    // Event: Request full physics state from Host (when a spectator joins late)
    socket.on('physics:request-state', () => {
      if (!currentRoomCode) return;
      const room = rooms.get(currentRoomCode);
      if (room && room.hostSocketId) {
        // Forward request to Host socket
        io.to(room.hostSocketId).emit('physics:request-state', {
          requesterSocketId: socket.id
        });
      }
    });

    // Event: Relaying full physics state response from Host to the requesting Spectator
    socket.on('physics:state-response', ({ requesterSocketId, state }) => {
      // Send directly to the requester
      io.to(requesterSocketId).emit('physics:state-response', state);
    });

    // Event: Send chat message
    socket.on('chat:send', ({ text }) => {
      if (!currentRoomCode) return;

      const messagePayload = {
        id: `${socket.id}-${Date.now()}`,
        username: currentUsername,
        text,
        timestamp: new Date()
      };

      // Broadcast to all room occupants (including sender)
      io.to(`room:${currentRoomCode}`).emit('chat:message', messagePayload);
    });

    // Event: Client left room explicitly
    socket.on('room:leave', () => {
      handleLeaveRoom();
    });

    // Event: Connection Disrupted
    socket.on('disconnect', () => {
      console.log(`[Socket Disconnected]: Socket ID ${socket.id}`);
      handleLeaveRoom();
    });
  });
};
