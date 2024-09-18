import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../middlewares/verifyJWT';
import Message from '../models/messageModel';

export const configureChatSocket = (io: Server) => {
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log('Um usuário se conectou:', socket.user?.username);

    socket.on('sendMessage', async (messageText: string) => {
      if (!socket.user) {
        socket.emit('error', 'Usuário não autenticado');
        return;
      }

      try {
        const message = new Message({
          sender: socket.user._id,
          text: messageText,
        });
        await message.save();

        // Emite a mensagem para todos os clientes conectados
        io.emit('newMessage', {
          sender: socket.user.username,
          text: messageText,
          createdAt: message.createdAt,
        });
      } catch (error) {
        console.error('Erro ao salvar mensagem:', error);
        socket.emit('error', 'Erro ao enviar mensagem');
      }
    });

    socket.on('disconnect', () => {
      console.log('Um usuário se desconectou:', socket.user?.username);
    });
  });
};