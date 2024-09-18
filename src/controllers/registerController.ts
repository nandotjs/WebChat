import { Request, Response } from 'express';
import User, { IUser } from '../models/userModel';
import generateToken from '../utils/generateToken';
import { registerSchema } from '../schemas/userSchema';
import { z } from 'zod';

export const registerUser = async (req: Request, res: Response) => {
  try {
    // Validar os dados de entrada
    const validatedData = registerSchema.parse(req.body);

    const { username, email, password } = validatedData;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id as string),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Zod error
      return res.status(400).json({ message: 'Dados inválidos', errors: error.errors });
    }
    res.status(400).json({ message: 'Erro ao registrar usuário', error });
  }
};
