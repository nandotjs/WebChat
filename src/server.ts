import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import rateLimit from 'express-rate-limit';
import http from 'http';
import { initializeSocketServer } from './socket/socketServer';
import { configureChatSocket } from './socket/chatSocket';
import cors from 'cors';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = initializeSocketServer(server);

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Limite de requisições excedido, tente novamente mais tarde',
});

app.use(limiter);

app.use('/api/auth', authRoutes);

configureChatSocket(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor HTTP rodando na porta ${PORT}`);
  console.log(`Socket.IO disponível em http://localhost:${PORT}`);
});
