import { Router } from 'express';
import { register, login, logout, refresh, getCurrentUser } from '../controllers/authController';
import { validateRequest, verifyToken } from '../middlewares/authMiddleware';
import { LoginSchema, RegisterSchema } from '@gigflow/shared';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/register', authLimiter, validateRequest(RegisterSchema), register);
router.post('/login', authLimiter, validateRequest(LoginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refresh);
router.get('/me', verifyToken, getCurrentUser);

export default router;
