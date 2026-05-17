import { Router } from 'express';
import { createLead, getLeads, getLeadById, updateLead, deleteLead } from '../controllers/leadController';
import { verifyToken, validateRequest } from '../middlewares/authMiddleware';
import { CreateLeadSchema, UpdateLeadSchema } from '@gigflow/shared';

const router = Router();

// Protect all routes
router.use(verifyToken);

router.post('/', validateRequest(CreateLeadSchema), createLead);
router.get('/', getLeads);
router.get('/:id', getLeadById);
router.patch('/:id', validateRequest(UpdateLeadSchema), updateLead);
router.delete('/:id', deleteLead);

export default router;
