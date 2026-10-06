import api from './api';

export const commentService = {
  getCommentsByPost: async (postId) => {
    const res = await api.get(`/posts/${postId}/comments`);
    return res.data;
  },

  addComment: async (postId, content) => {
    const res = await api.post(`/posts/${postId}/comments`, { content });
    return res.data;
  },

  updateComment: async (commentId, content) => {
    const res = await api.put(`/comments/${commentId}`, { content });
    return res.data;
  },

  deleteComment: async (commentId) => {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  }
};

export default commentService;
