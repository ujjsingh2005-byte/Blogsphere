import express from 'express';
import { getUserStats } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', protect, getUserStats);

export default router;
