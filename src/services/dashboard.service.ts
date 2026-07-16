import api from '@/config/api';

export const dashboardService = {
  getStats: () => api.get('/dashboard/stats').then(r => r.data.data),
  getRiskTrend: (period = '24h') => api.get('/dashboard/risk-trend', { params: { period } }).then(r => r.data.data),
  getActivityFeed: (limit = 50) => api.get('/dashboard/activity-feed', { params: { limit } }).then(r => r.data.data),
  getIncidentStats: (period = '30d') => api.get('/dashboard/incident-stats', { params: { period } }).then(r => r.data.data),
  getWorkerDistribution: () => api.get('/dashboard/worker-distribution').then(r => r.data.data),
};
