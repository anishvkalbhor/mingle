import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ClerkExpressWithAuth, verifyToken } from '@clerk/clerk-sdk-node';
import { Server as SocketIOServer } from 'socket.io';
import ChatRoom from './models/ChatRoom';
import Message from './models/Message';

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import matchRoutes from './routes/match';
import chatRoutes from './routes/chat';
import { IApiResponse } from './types';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add Clerk authentication middleware
app.use(ClerkExpressWithAuth());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dating-app';

console.log('Connecting to MongoDB...');
// For socket.io integration, export app and server
let serverInstance: any = null;
let io: SocketIOServer | null = null;

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('MongoDB Connected Successfully');
  // Start server after DB connection
  const PORT = process.env.PORT || 5000;
  serverInstance = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  // Initialize socket.io
  io = new SocketIOServer(serverInstance, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on('connection', async (socket) => {
    // Clerk token validation
    const token = socket.handshake.auth && socket.handshake.auth.token;
    let userId = null;
    if (token) {
      try {
        const payload = await verifyToken(token, { issuer: process.env.CLERK_ISSUER || '' });
        userId = payload.sub || payload.userId || payload.id;
        socket.data.userId = userId;
      } catch (err) {
        socket.emit('error', 'Unauthenticated');
        socket.disconnect();
        return;
      }
    } else {
      socket.emit('error', 'Unauthenticated');
      socket.disconnect();
      return;
    }

    // Join chat room
    socket.on('joinRoom', async ({ roomId, userId: joinUserId }) => {
      if (joinUserId !== socket.data.userId) {
        socket.emit('error', 'User ID mismatch');
        return;
      }
      const chatRoom = await ChatRoom.findOne({ roomId });
      if (!chatRoom) {
        socket.emit('error', 'Chat room not found');
        return;
      }
      // Only allow users in the room
      if (!chatRoom.userIds.includes(socket.data.userId)) {
        socket.emit('error', 'Not authorized for this room');
        return;
      }
      // Check if expired
      const now = new Date();
      if (now > chatRoom.expiresAt) {
        socket.emit('roomLocked', { roomId });
        return;
      }
      socket.join(roomId);
      socket.emit('joinedRoom', { roomId });
    });

    // Handle sending a message
    socket.on('sendMessage', async ({ roomId, userId: msgUserId, content }) => {
      if (msgUserId !== socket.data.userId) {
        socket.emit('error', 'User ID mismatch');
        return;
      }
      const chatRoom = await ChatRoom.findOne({ roomId });
      if (!chatRoom) {
        socket.emit('error', 'Chat room not found');
        return;
      }
      // Only allow users in the room
      if (!chatRoom.userIds.includes(socket.data.userId)) {
        socket.emit('error', 'Not authorized for this room');
        return;
      }
      // Check if expired
      const now = new Date();
      if (now > chatRoom.expiresAt) {
        socket.emit('roomLocked', { roomId });
        return;
      }
      // Only allow text/emoji
      if (/https?:\/\//.test(content) || /<img|<video|<audio|<a /.test(content)) {
        socket.emit('error', 'Media not allowed');
        return;
      }
      const message = new Message({ roomId, senderId: socket.data.userId, content, timestamp: now });
      await message.save();
      io?.to(roomId).emit('newMessage', {
        roomId,
        senderId: socket.data.userId,
        content,
        timestamp: now,
      });
    });
  });
})
.catch(err => {
  console.error('MongoDB Connection Error:', err);
  process.exit(1);
});

export { app, serverInstance };

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/support-ticket', require('./routes/supportTicket').default);

// Health check route
app.get('/', (_req: Request, res: Response<IApiResponse>) => {
  return res.status(200).json({ 
    status: 'success', 
    message: 'Server is running' 
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response<IApiResponse>, _next: NextFunction) => {
  console.error(err.stack);
  return res.status(500).json({ 
    status: 'error',
    message: 'Something went wrong!',
    data: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}); 