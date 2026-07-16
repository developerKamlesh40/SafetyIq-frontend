import api from '@/config/api';

export const maintenanceService = {
  getAll: (params?: any) => api.get('/maintenance', { params }).then(r => r.data),
  getById: (id: number) => api.get(`/maintenance/${id}`).then(r => r.data.data),
  create: (data: any) => api.post('/maintenance', data).then(r => r.data.data),
  update: (id: number, data: any) => api.put(`/maintenance/${id}`, data).then(r => r.data.data),
  getOverdue: () => api.get('/maintenance/overdue').then(r => r.data.data),
};
