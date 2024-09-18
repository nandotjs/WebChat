import { Router } from 'express';
import { loginUser } from '../controllers/loginController'; 
import { registerUser } from '../controllers/registerController';

const router = Router();

// Rota para registrar um novo usuário
router.post('/register', registerUser);

// Rota para login de usuário
router.post('/login', loginUser);

export default router;
