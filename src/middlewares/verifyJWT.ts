import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/userModel';

interface JwtPayload {
  id: string;
}

export interface AuthenticatedSocket extends Socket {
  user?: IUser;
}

export const protectSocket = async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
  console.log('Tentativa de conexão Socket.IO');
  let token = socket.handshake.auth.token || socket.handshake.headers.authorization;

  if (token && typeof token === 'string' && token.startsWith('Bearer ')) {
    token = token.split(' ')[1];
  }

  console.log('Token recebido:', token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

      // Encontra o usuário no banco de dados
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return next(new Error('Usuário não encontrado'));
      }

      socket.user = user; // Anexa o usuário autenticado ao socket
      next();
    } catch (error) {
      console.error('Erro ao verificar token:', error);
      next(new Error('Token inválido, não autorizado'));
    }
  } else {
    next(new Error('Token não encontrado, não autorizado'));
  }
};
