import api from '@/config/api';

export const reportsService = {
  getAll: (params?: any) => api.get('/reports', { params }).then(r => r.data),
  getById: (id: number) => api.get(`/reports/${id}`).then(r => r.data.data),
  generate: (data: any) => api.post('/reports/generate', data).then(r => r.data.data),
  getPdf: (id: number) => api.get(`/reports/${id}/pdf`, { responseType: 'blob' }).then(r => r.data),
};
