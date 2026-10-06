import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createReport, getMyReports } from '../controllers/reportController.js';

const router = express.Router();

router.use(protect);

router.post('/', createReport);
router.get('/my', getMyReports);

export default router;
