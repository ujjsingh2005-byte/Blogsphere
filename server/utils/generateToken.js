import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'blogsphere_secret_fallback', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};
