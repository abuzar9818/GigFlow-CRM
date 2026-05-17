import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import authRoutes from './authRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.get('/health', getHealth);

export default router;
