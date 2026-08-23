import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', requireAdmin, getSettings);
router.patch('/', requireAdmin, updateSettings);

export default router;
