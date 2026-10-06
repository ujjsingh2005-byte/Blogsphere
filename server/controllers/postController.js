import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

// Calculate estimated read time in minutes based on word count (200 wpm)
const calculateReadTime = (text) => {
  const words = text ? text.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200));
};

// @desc    Get all blog posts with pagination, search, category filter, sorting
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const startIndex = (page - 1) * limit;

    const { category, search, sort } = req.query;

    const query = {};

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Search filter across title, content, and author name
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { authorName: searchRegex },
        { category: searchRegex }
      ];
    }

    // Sort order
    let sortOption = { createdAt: -1 }; // Default: newest first
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else if (sort === 'title_asc') {
      sortOption = { title: 1 };
    } else if (sort === 'title_desc') {
      sortOption = { title: -1 };
    }

    const total = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('author', 'name email profileImage bio')
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

// @desc    Get single blog post by ID with author and comments count
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email profileImage bio')
      .populate('commentsCount');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, content, category, coverImage } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, and category for the post'
      });
    }

    const readTime = calculateReadTime(content);

    const post = await Post.create({
      title,
      content,
      category,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      author: req.user._id,
      authorName: req.user.name,
      readTime
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'name email profileImage bio');

    res.status(201).json({
      success: true,
      message: 'Blog post published successfully',
      data: populatedPost
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog post
// @route   PUT /api/posts/:id
// @access  Private (Owner only)
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Ownership check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You are not allowed to edit another author’s post'
      });
    }

    const { title, content, category, coverImage } = req.body;

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    if (coverImage) post.coverImage = coverImage;
    if (content) post.readTime = calculateReadTime(post.content);

    const updatedPost = await post.save();
    const populated = await Post.findById(updatedPost._id).populate('author', 'name email profileImage bio');

    res.json({
      success: true,
      message: 'Blog post updated successfully',
      data: populated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog post and its associated comments
// @route   DELETE /api/posts/:id
// @access  Private (Owner only)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Ownership check
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You are not allowed to delete another author’s post'
      });
    }

    // Delete all comments belonging to this post
    await Comment.deleteMany({ postId: post._id });

    // Delete post
    await post.deleteOne();

    res.json({
      success: true,
      message: 'Blog post and associated comments deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts created by authenticated user
// @route   GET /api/posts/user/me
// @access  Private
export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('commentsCount')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    next(error);
  }
};
