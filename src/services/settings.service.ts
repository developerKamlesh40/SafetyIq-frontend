import api from '@/config/api';

export const settingsService = {
  getAll: () => api.get('/settings').then(r => r.data.data),
  getByCategory: (category: string) => api.get(`/settings/${category}`).then(r => r.data.data),
  update: (category: string, data: any) => api.put(`/settings/${category}`, data).then(r => r.data.data),
  createUser: (data: any) => api.post('/auth/register', data).then(r => r.data.data),
};
