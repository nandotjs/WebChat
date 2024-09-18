import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { protectSocket } from './middlewares/verifyJWT';
import { configureChatSocket } from './socket/chatSocket';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Em produção, especifique os domínios permitidos
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita cada IP a 100 requisições por 'window' (15 min)
  message: 'Limite de requisições excedido, tente novamente mais tarde',
});

app.use(limiter);

app.use('/api/auth', authRoutes);

io.on('connection', (socket) => {
  console.log('Nova conexão Socket.IO');
});

io.use(protectSocket);
configureChatSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
  console.log(`Socket.IO disponível em http://localhost:${PORT}`);
});
