export const validateEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateName = (name) => {
  return name && name.trim().length >= 2;
};

export const validatePostForm = ({ title, content, category }) => {
  const errors = {};
  if (!title || title.trim().length < 5) {
    errors.title = 'Title must be at least 5 characters long';
  }
  if (!content || content.trim().length < 20) {
    errors.content = 'Content must be at least 20 characters long';
  }
  if (!category) {
    errors.category = 'Please select a category';
  }
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
