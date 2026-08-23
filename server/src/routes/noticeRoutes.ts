import { Router } from 'express';
import { getAllNotices, createNotice, updateNotice, deleteNotice } from '../controllers/noticeController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getAllNotices);
router.post('/', requireAdmin, createNotice);
router.patch('/:id', requireAdmin, updateNotice);
router.delete('/:id', requireAdmin, deleteNotice);

export default router;
