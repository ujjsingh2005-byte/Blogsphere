import api from './api';

const reportService = {
  submitReport: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },

  getMyReports: async () => {
    const response = await api.get('/reports/my');
    return response.data;
  }
};

export default reportService;
