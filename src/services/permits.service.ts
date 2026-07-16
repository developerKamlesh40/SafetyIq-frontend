import api from '@/config/api';

export const permitsService = {
  getAll: (params?: any) => api.get('/permits', { params }).then(r => r.data),
  getActive: () => api.get('/permits/active').then(r => r.data.data),
  getExpiring: (within = 60) => api.get('/permits/expiring', { params: { within } }).then(r => r.data.data),
  getById: (id: number) => api.get(`/permits/${id}`).then(r => r.data.data),
  create: (data: any) => api.post('/permits', data).then(r => r.data.data),
  update: (id: number, data: any) => api.put(`/permits/${id}`, data).then(r => r.data.data),
  approve: (id: number) => api.put(`/permits/${id}/approve`).then(r => r.data.data),
  suspend: (id: number, reason: string) => api.put(`/permits/${id}/suspend`, { reason }).then(r => r.data.data),
};
