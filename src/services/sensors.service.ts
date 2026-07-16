import api from '@/config/api';

export const sensorsService = {
  getAll: (params?: any) => api.get('/sensors', { params }).then(r => r.data),
  getLatest: (zoneId?: number) => api.get('/sensors/latest', { params: { zone_id: zoneId } }).then(r => r.data.data),
  getAlarms: (params?: any) => api.get('/sensors/alarms', { params }).then(r => r.data.data),
  getThresholds: () => api.get('/sensors/thresholds').then(r => r.data.data),
};
