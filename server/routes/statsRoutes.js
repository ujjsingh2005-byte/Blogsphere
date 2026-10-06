import express from 'express';
import { getUserStats, getPublicCategories } from '../controllers/statsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/user', protect, getUserStats);
router.get('/categories', getPublicCategories);

export default router;
