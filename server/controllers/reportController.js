import Report from '../models/Report.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';

// @desc    Create a content/user report
// @route   POST /api/reports
// @access  Private
export const createReport = async (req, res, next) => {
  try {
    const { targetType, targetId, reason, details } = req.body;

    if (!targetType || !targetId || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide targetType, targetId, and reason for the report.'
      });
    }

    let targetTitle = '';
    if (targetType === 'post') {
      const post = await Post.findById(targetId);
      if (post) targetTitle = post.title;
    } else if (targetType === 'comment') {
      const comment = await Comment.findById(targetId);
      if (comment) targetTitle = comment.content.slice(0, 50) + '...';
    } else if (targetType === 'user') {
      const user = await User.findById(targetId);
      if (user) targetTitle = user.name;
    }

    // Check if user already reported this exact item pending
    const existing = await Report.findOne({
      reporter: req.user._id,
      targetId,
      status: 'pending'
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a pending report for this item. Our moderation team is reviewing it.'
      });
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetId,
      targetTitle,
      reason,
      details: details || '',
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted successfully. Thank you for keeping BlogSphere safe.',
      data: report
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reports created by current user
// @route   GET /api/reports/my
// @access  Private
export const getMyReports = async (req, res, next) => {
  try {
    const reports = await Report.find({ reporter: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reports
    });
  } catch (error) {
    next(error);
  }
};
