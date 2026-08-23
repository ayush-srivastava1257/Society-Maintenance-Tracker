import { Router } from 'express';
import {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,
  updateStatus,
  updatePriority,
} from '../controllers/complaintController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = Router();

router.use(authenticateToken);

router.post('/', upload.single('photo'), createComplaint);
router.get('/my', getMyComplaints);
router.get('/', requireAdmin, getAllComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/status', requireAdmin, updateStatus);
router.patch('/:id/priority', requireAdmin, updatePriority);

export default router;
