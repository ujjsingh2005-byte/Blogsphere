import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  getMyPosts
} from '../controllers/postController.js';
import {
  getCommentsByPost,
  addComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Specific routes before param routes
router.get('/user/me', protect, getMyPosts);

// Post comments routes (nested)
router.route('/:postId/comments')
  .get(getCommentsByPost)
  .post(protect, addComment);

// Core post routes
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
