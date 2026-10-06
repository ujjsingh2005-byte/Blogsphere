import express from 'express';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import {
  getAdminStats,
  getAllUsers,
  toggleBlockUser,
  updateUserRole,
  deleteUser,
  getAllPostsAdmin,
  deletePostAdmin,
  getAllCommentsAdmin,
  deleteCommentAdmin,
  getCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  getReportsAdmin,
  updateReportStatus,
  deleteReport
} from '../controllers/adminController.js';

const router = express.Router();

// All routes here require auth + admin role
router.use(protect, adminOnly);

// Stats
router.get('/stats', getAdminStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/block', toggleBlockUser);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Post Moderation
router.get('/posts', getAllPostsAdmin);
router.delete('/posts/:id', deletePostAdmin);

// Comment Moderation
router.get('/comments', getAllCommentsAdmin);
router.delete('/comments/:id', deleteCommentAdmin);

// Category Management
router.get('/categories', getCategoriesAdmin);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Report Moderation
router.get('/reports', getReportsAdmin);
router.put('/reports/:id', updateReportStatus);
router.delete('/reports/:id', deleteReport);

export default router;
