import api from '@/config/api';

export const alertsService = {
  getAll: (params?: any) => api.get('/alerts', { params }).then(r => r.data),
  getActive: () => api.get('/alerts/active').then(r => r.data.data),
  acknowledge: (id: number) => api.put(`/alerts/${id}/acknowledge`).then(r => r.data.data),
  resolve: (id: number, notes?: string) => api.put(`/alerts/${id}/resolve`, { resolution_notes: notes }).then(r => r.data.data),
};
