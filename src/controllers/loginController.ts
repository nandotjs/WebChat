import { Request, Response } from 'express';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';
import { loginSchema } from '../schemas/userSchema';
import { z } from 'zod';

export const loginUser = async (req: Request, res: Response) => {
  try {
    // Validar os dados de entrada
    const validatedData = loginSchema.parse(req.body);

    const { email, password } = validatedData;

    const user = await User.findOne({ email }).exec();
    if (user && await (user as any).matchPassword(password)) {
        res.json({
          _id: user._id.toString(),
          username: user.username,
          email: user.email,
          token: generateToken(user._id.toString()),
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
