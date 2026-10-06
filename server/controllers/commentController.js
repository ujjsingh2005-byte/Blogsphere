import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Get all comments for a blog post
// @route   GET /api/posts/:postId/comments
// @access  Public
export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .populate('author', 'name email profileImage bio')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a blog post
// @route   POST /api/posts/:postId/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty'
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    const comment = await Comment.create({
      content: content.trim(),
      postId,
      author: req.user._id
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'author',
      'name email profileImage bio'
    );

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PUT /api/comments/:id
// @access  Private (Owner only)
export const updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Comment content cannot be empty'
      });
    }

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Ownership check
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only edit your own comments'
      });
    }

    comment.content = content.trim();
    const updatedComment = await comment.save();

    const populated = await Comment.findById(updatedComment._id).populate(
      'author',
      'name email profileImage bio'
    );

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Owner only)
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Ownership check
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only delete your own comments'
      });
    }

    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
