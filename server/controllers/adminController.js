import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import Category from '../models/Category.js';
import Report from '../models/Report.js';

// ==========================================
// 1. STATS & ANALYTICS
// ==========================================

// @desc    Get Platform Statistics & Metrics for Admin Dashboard
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalAdmins,
      blockedUsers,
      totalPosts,
      totalComments,
      totalReports,
      pendingReports,
      recentUsers,
      recentPosts,
      recentReports,
      categoryStats
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'admin' }),
      User.countDocuments({ isBlocked: true }),
      Post.countDocuments(),
      Comment.countDocuments(),
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('name email role isBlocked createdAt profileImage'),
      Post.find().sort({ createdAt: -1 }).limit(5).populate('author', 'name email profileImage').select('title category author createdAt readTime'),
      Report.find().sort({ createdAt: -1 }).limit(5).populate('reporter', 'name email').select('targetType reason status createdAt details targetTitle'),
      Post.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          activeUsers: totalUsers - blockedUsers,
          totalAdmins,
          blockedUsers,
          totalPosts,
          totalComments,
          totalReports,
          pendingReports
        },
        categoryStats,
        recentActivity: {
          users: recentUsers,
          posts: recentPosts,
          reports: recentReports
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 2. USER MANAGEMENT
// ==========================================

// @desc    Get all users with search, role filter, status filter, pagination
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const { search, role, status, sort } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: regex }, { email: regex }];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status === 'blocked') {
      query.isBlocked = true;
    } else if (status === 'active') {
      query.isBlocked = false;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'name_asc') sortOption = { name: 1 };
    if (sort === 'name_desc') sortOption = { name: -1 };

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit)
      .select('-password');

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit) || 1,
          totalUsers: total,
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle block/unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
export const toggleBlockUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block or suspend your own admin account.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      success: true,
      message: `User account has been ${user.isBlocked ? 'blocked' : 'unblocked'} successfully.`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (user/admin)
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role specified. Must be "user" or "admin".'
      });
    }

    if (id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You cannot demote yourself from admin role.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role} successfully.`,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBlocked: user.isBlocked
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account and all their content
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own admin account.'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user's posts and comments
    const userPosts = await Post.find({ author: id });
    const postIds = userPosts.map(p => p._id);
    
    await Comment.deleteMany({ $or: [{ author: id }, { postId: { $in: postIds } }] });
    await Post.deleteMany({ author: id });
    await Report.deleteMany({ $or: [{ reporter: id }, { targetId: id }] });
    await user.deleteOne();

    res.json({
      success: true,
      message: `User ${user.name} and all associated data deleted successfully.`
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 3. BLOG POSTS MODERATION
// ==========================================

// @desc    Get all posts for admin with filter & search
// @route   GET /api/admin/posts
// @access  Private/Admin
export const getAllPostsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const { search, category, sort } = req.query;
    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: regex }, { authorName: regex }, { category: regex }];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'title_asc') sortOption = { title: 1 };

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email profileImage role isBlocked')
      .populate('commentsCount')
      .sort(sortOption)
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit) || 1,
          totalPosts: total,
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete post by admin
// @route   DELETE /api/admin/posts/:id
// @access  Private/Admin
export const deletePostAdmin = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await Comment.deleteMany({ postId: post._id });
    await Report.deleteMany({ targetId: post._id.toString() });
    await post.deleteOne();

    res.json({
      success: true,
      message: 'Post and associated comments deleted by administrator.'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 4. COMMENTS MODERATION
// ==========================================

// @desc    Get all comments across platform
// @route   GET /api/admin/comments
// @access  Private/Admin
export const getAllCommentsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 15;
    const startIndex = (page - 1) * limit;

    const { search } = req.query;
    const query = {};

    if (search && search.trim() !== '') {
      query.content = new RegExp(search.trim(), 'i');
    }

    const total = await Comment.countDocuments(query);
    const comments = await Comment.find(query)
      .populate('author', 'name email profileImage role isBlocked')
      .populate('postId', 'title')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      data: {
        comments,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit) || 1,
          totalComments: total,
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete comment by admin
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
export const deleteCommentAdmin = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    await Report.deleteMany({ targetId: comment._id.toString() });
    await comment.deleteOne();

    res.json({
      success: true,
      message: 'Comment removed by administrator.'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 5. CATEGORY MANAGEMENT
// ==========================================

// @desc    Get all categories with post counts
// @route   GET /api/admin/categories
// @access  Public / Admin
export const getCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    // Calculate dynamic post counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Post.countDocuments({ category: cat.name });
        return {
          _id: cat._id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          color: cat.color,
          postCount: count,
          createdAt: cat.createdAt
        };
      })
    );

    res.json({
      success: true,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Private/Admin
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, color } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Category.findOne({ $or: [{ name: name.trim() }, { slug }] });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      slug,
      description: description || '',
      color: color || 'from-blue-500 to-indigo-600'
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    const oldName = category.name;

    if (name && name.trim() !== '') {
      category.name = name.trim();
      category.slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }
    if (description !== undefined) category.description = description;
    if (color) category.color = color;

    const updated = await category.save();

    // If category name changed, update all existing posts using oldName
    if (name && name.trim() !== oldName) {
      await Post.updateMany({ category: oldName }, { category: updated.name });
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if posts are using this category
    const count = await Post.countDocuments({ category: category.name });
    if (count > 0) {
      // Reassign to 'General' category or warn
      let generalCat = await Category.findOne({ name: 'General' });
      if (!generalCat) {
        generalCat = await Category.create({
          name: 'General',
          slug: 'general',
          description: 'General miscellaneous articles',
          color: 'from-gray-500 to-slate-600'
        });
      }
      await Post.updateMany({ category: category.name }, { category: 'General' });
    }

    await category.deleteOne();

    res.json({
      success: true,
      message: 'Category deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// 6. REPORTS & CONTENT MODERATION
// ==========================================

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getReportsAdmin = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const { status, targetType } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }
    if (targetType && targetType !== 'all') {
      query.targetType = targetType;
    }

    const total = await Report.countDocuments(query);
    const reports = await Report.find(query)
      .populate('reporter', 'name email profileImage role')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      success: true,
      data: {
        reports,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit) || 1,
          totalReports: total,
          limit
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update report status and admin notes
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
export const updateReportStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;

    const updated = await report.save();
    const populated = await Report.findById(updated._id).populate('reporter', 'name email profileImage role');

    res.json({
      success: true,
      message: 'Report status updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a report
// @route   DELETE /api/admin/reports/:id
// @access  Private/Admin
export const deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    await report.deleteOne();

    res.json({
      success: true,
      message: 'Report deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};
