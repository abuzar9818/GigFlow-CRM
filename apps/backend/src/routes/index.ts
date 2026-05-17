import { Router } from 'express';
import { getHealth } from '../controllers/healthController';
import authRoutes from './authRoutes';
import leadRoutes from './leadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);
router.get('/health', getHealth);

export default router;
