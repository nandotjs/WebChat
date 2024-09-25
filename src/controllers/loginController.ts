import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import generateToken from '../utils/generateToken';
import { loginSchema } from '../schemas/userSchema';
import { z } from 'zod';
import { io } from '../socket/socketServer'; 

export const loginUser = async (req: Request, res: Response) => {
  try {
    // Validar os dados de entrada
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    const user = await User.findOne({ email }).exec();
    if (user && await user.matchPassword(password)) {
      const token = generateToken(user._id as string);
      
      // Emitir um evento de login bem-sucedido via Socket.IO
      io.emit('userLoggedIn', { userId: user._id });

      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Credenciais inválidas' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Erro de validação Zod
      return res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
    }
    // Outros erros
    res.status(400).json({ message: 'Erro ao fazer login', error });
  }
};
