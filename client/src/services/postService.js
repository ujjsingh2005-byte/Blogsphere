import api from './api';

export const postService = {
  getAllPosts: async (params = {}) => {
    const res = await api.get('/posts', { params });
    return res.data;
  },

  getPostById: async (id) => {
    const res = await api.get(`/posts/${id}`);
    return res.data;
  },

  createPost: async (postData) => {
    const res = await api.post('/posts', postData);
    return res.data;
  },

  updatePost: async (id, postData) => {
    const res = await api.put(`/posts/${id}`, postData);
    return res.data;
  },

  deletePost: async (id) => {
    const res = await api.delete(`/posts/${id}`);
    return res.data;
  },

  getMyPosts: async () => {
    const res = await api.get('/posts/user/me');
    return res.data;
  }
};

export default postService;
