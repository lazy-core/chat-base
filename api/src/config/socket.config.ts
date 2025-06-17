import { Server } from 'socket.io';
import { Server as TServer } from 'http';
import { createAdapter } from '@socket.io/redis-adapter';
import redis from './redis.config';

let io: Server | null = null;

const initSocket = (httpServer: TServer) => {
  const pubClient = redis;
  const subClient = pubClient.duplicate();
  const adapter = createAdapter(pubClient, subClient);

  io = new Server(httpServer, {
    adapter,
    connectionStateRecovery: {
      maxDisconnectionDuration: 1000,
    },
    cors: {
      origin: '*',
    },
    maxHttpBufferSize: 1e8,
  });

  console.info(`Socket.io initialized`);
  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export { initSocket, getIO };
