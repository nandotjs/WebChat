import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { protectSocket } from '../middlewares/verifyJWT';

let io: Server;

export const initializeSocketServer = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*", // Em produção, especifique os domínios permitidos
      methods: ["GET", "POST"]
    }
  });

  io.use(protectSocket);

  return io;
};

export { io };