import api from '@/config/api';

export const complianceService = {
  getStatus: () => api.get('/compliance/status').then(r => r.data.data),
  getRegulations: () => api.get('/compliance/regulations').then(r => r.data.data),
  getChecklist: (category?: string) => api.get('/compliance/checklist', { params: { category } }).then(r => r.data.data),
};
