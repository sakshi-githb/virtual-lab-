import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.js';
import aiRouter from './routes/ai.js';
import experimentRouter from './routes/experiments.js';
import connectDB from './config/db.js';
import { initSockets } from './sockets/socketManager.js';

// Load environmental variables
dotenv.config();

// Connect to MongoDB Database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors({
  origin: '*', // Allows broad prototyping client connections
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

// Routes Mount point
app.use('/api/auth', authRouter);
app.use('/api/ai', aiRouter);
app.use('/api/experiments', experimentRouter);

// Heartbeat health check API
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date(),
    service: 'VIRTUAL-LAB Backend API'
  });
});

// Wrap Express App in HTTP Server for Sockets integration
const httpServer = createServer(app);

// Initialize Socket.io Server instance
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Orchestrate socket handlers
initSockets(io);

// Start listening
httpServer.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🧪 VIRTUAL-LAB server listening on port: ${PORT}`);
  console.log(`📡 Health Check URL: http://localhost:${PORT}/health`);
  console.log(`==================================================`);
});
