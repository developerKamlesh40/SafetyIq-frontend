import api from '@/config/api';

export const workersService = {
  getAll: (params?: any) => api.get('/workers', { params }).then(r => r.data),
  getOnSite: () => api.get('/workers/on-site').then(r => r.data.data),
  getByZone: (zoneId: number) => api.get(`/workers/by-zone/${zoneId}`).then(r => r.data.data),
  create: (data: any) => api.post('/workers', data).then(r => r.data.data),
  update: (id: number, data: any) => api.put(`/workers/${id}`, data).then(r => r.data.data),
  remove: (id: number) => api.delete(`/workers/${id}`).then(r => r.data),
};
