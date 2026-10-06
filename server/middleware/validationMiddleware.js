export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Name is required and must be at least 2 characters long'
    });
  }
  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address'
    });
  }
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  next();
};

export const validatePost = (req, res, next) => {
  const { title, content, category } = req.body;
  if (!title || title.trim().length < 5) {
    return res.status(400).json({
      success: false,
      message: 'Title is required and must be at least 5 characters long'
    });
  }
  if (!content || content.trim().length < 20) {
    return res.status(400).json({
      success: false,
      message: 'Content is required and must be at least 20 characters long'
    });
  }
  next();
};

export const validateComment = (req, res, next) => {
  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Comment content cannot be empty'
    });
  }
  next();
};
