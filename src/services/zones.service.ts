import api from '@/config/api';

export const zonesService = {
  getAll: () => api.get('/zones').then(r => r.data.data),
  getById: (id: number) => api.get(`/zones/${id}`).then(r => r.data.data),
  getRiskHistory: (id: number, period = '24h') => api.get(`/zones/${id}/risk-history`, { params: { period } }).then(r => r.data.data),
  update: (id: number, data: any) => api.put(`/zones/${id}`, data).then(r => r.data.data),
};
