import { Router } from 'express';
import { getAdminDashboard, getResidentDashboard } from '../controllers/dashboardController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/admin', requireAdmin, getAdminDashboard);
router.get('/resident', getResidentDashboard);

export default router;
