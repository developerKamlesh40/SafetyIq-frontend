import api from '@/config/api';
import { useQuery } from '@tanstack/react-query';

export function useDashboardData() {
  const stats = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data.data),
    refetchInterval: 15000,
  });

  const riskTrend = useQuery({
    queryKey: ['risk-trend'],
    queryFn: () => api.get('/dashboard/risk-trend', { params: { period: '24h' } }).then(r => r.data.data),
    refetchInterval: 30000,
  });

  const activityFeed = useQuery({
    queryKey: ['activity-feed'],
    queryFn: () => api.get('/dashboard/activity-feed', { params: { limit: 50 } }).then(r => r.data.data),
    refetchInterval: 10000,
  });

  const workerDistribution = useQuery({
    queryKey: ['worker-distribution'],
    queryFn: () => api.get('/dashboard/worker-distribution').then(r => r.data.data),
    refetchInterval: 30000,
  });

  return { stats, riskTrend, activityFeed, workerDistribution };
}
