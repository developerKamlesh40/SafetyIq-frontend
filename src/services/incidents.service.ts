import api from '@/config/api';

export const incidentsService = {
  getAll: (params?: any) => api.get('/incidents', { params }).then(r => r.data),
  getToday: () => api.get('/incidents/today').then(r => r.data.data),
  getStats: (period = '30d') => api.get('/incidents/stats', { params: { period } }).then(r => r.data.data),
  getById: (id: number) => api.get(`/incidents/${id}`).then(r => r.data.data),
  create: (data: any) => api.post('/incidents', data).then(r => r.data.data),
  update: (id: number, data: any) => api.put(`/incidents/${id}`, data).then(r => r.data.data),
};
