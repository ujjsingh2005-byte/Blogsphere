import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Category from '../models/Category.js';

// @desc    Get dashboard metrics for authenticated user
// @route   GET /api/stats/user
// @access  Private
export const getUserStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Total posts by user
    const totalPosts = await Post.countDocuments({ author: userId });

    // Find all post IDs created by user
    const userPosts = await Post.find({ author: userId }).select('_id readTime');
    const userPostIds = userPosts.map((p) => p._id);

    // Total comments received on user's posts
    const totalCommentsReceived = await Comment.countDocuments({
      postId: { $in: userPostIds }
    });

    // Total comments written by user
    const totalCommentsWritten = await Comment.countDocuments({
      author: userId
    });

    // Sum of estimated read time generated across all user posts
    const totalReadTimeMinutes = userPosts.reduce((acc, curr) => acc + (curr.readTime || 3), 0);

    // Recent 5 posts by user
    const recentPosts = await Post.find({ author: userId })
      .populate('commentsCount')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent comments on user's posts
    const recentComments = await Comment.find({ postId: { $in: userPostIds } })
      .populate('author', 'name email profileImage')
      .populate('postId', 'title')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalPosts,
        totalCommentsReceived,
        totalCommentsWritten,
        totalReadTimeMinutes,
        recentPosts,
        recentComments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get public categories list with post counts
// @route   GET /api/stats/categories
// @access  Public
export const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const counts = await Post.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[c._id] = c.count; });

    const data = categories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      color: cat.color,
      postCount: countMap[cat.name] || 0
    }));

    res.json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
