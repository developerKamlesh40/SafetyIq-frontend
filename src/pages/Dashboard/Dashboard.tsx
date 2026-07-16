import { useDashboardData } from './hooks/useDashboardData';
import StatsGrid from './components/StatsGrid';
import SafetyScoreGauge from './components/SafetyScoreGauge';
import LiveActivityFeed from './components/LiveActivityFeed';
import ZoneOverview from './components/ZoneOverview';
import IncidentsChart from './components/IncidentsChart';
import { useSocket } from '../../hooks/useSocket';

export default function Dashboard() {
  const { stats, riskTrend, activityFeed, workerDistribution } = useDashboardData();
  useSocket();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-safety-muted text-sm mt-1">Real-time safety intelligence overview</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-safety-green animate-pulse" />
          <span className="text-xs text-safety-muted">Live</span>
        </div>
      </div>

      <StatsGrid stats={stats.data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <SafetyScoreGauge score={stats.data?.safetyScore} />
        <div className="lg:col-span-2">
          <LiveActivityFeed feed={activityFeed.data} isLoading={activityFeed.isLoading} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ZoneOverview distribution={workerDistribution.data} />
        <IncidentsChart data={riskTrend.data} />
      </div>
    </div>
  );
}
