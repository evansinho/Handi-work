import { Server } from 'socket.io';
import { createServer } from 'http';
import type { Express } from 'express';

let io: Server;

export const setupWebSocket = (app: Express) => {
  const httpServer = createServer(app);
  io = new Server(httpServer, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join', (userId) => {
      socket.join(userId.toString());
      console.log(`User ${userId} joined room ${userId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return httpServer;
};

export { io };
