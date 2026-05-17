import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { getAnalyticsOverview } from '../controllers/analyticsController';

const router = Router();

router.use(verifyToken);

router.get('/overview', getAnalyticsOverview);

export default router;