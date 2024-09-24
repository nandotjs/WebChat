import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../middlewares/verifyJWT';
import Message from '../models/messageModel';

export const configureChatSocket = (io: Server) => {
  io.on('connection', async (socket: AuthenticatedSocket) => {
    console.log('Um usuário se conectou:', socket.user?.username);

    // Load previous messages
    try {
      const messages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(50)
        .populate('sender', 'username');
      socket.emit('loadPreviousMessages', messages.reverse());
    } catch (error) {
      console.error('Erro ao carregar mensagens anteriores:', error);
    }

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

        // Send message to all connected clients
        io.emit('newMessage', {
          _id: message._id, // Add message ID
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