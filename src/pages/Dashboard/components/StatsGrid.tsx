import { Users, FileText, AlertTriangle, Radio, Shield } from 'lucide-react';

interface StatsGridProps {
  stats: {
    totalWorkers?: number;
    activePermits?: number;
    criticalZones?: number;
    gasAlerts?: number;
    safetyScore?: number;
    todaysIncidents?: number;
    emergencyStatus?: string;
  };
}

const statCards = [
  { key: 'totalWorkers', label: 'Workers On-Site', icon: Users, color: 'text-safety-cyan', bg: 'bg-safety-cyan/10' },
  { key: 'activePermits', label: 'Active Permits', icon: FileText, color: 'text-safety-amber', bg: 'bg-safety-amber/10' },
  { key: 'criticalZones', label: 'Critical Zones', icon: AlertTriangle, color: 'text-safety-red', bg: 'bg-safety-red/10' },
  { key: 'gasAlerts', label: 'Gas Alerts', icon: Radio, color: 'text-purple-400', bg: 'bg-purple-400/10' },
  { key: 'todaysIncidents', label: "Today's Incidents", icon: Shield, color: 'text-safety-amber', bg: 'bg-safety-amber/10' },
];

export default function StatsGrid({ stats }: StatsGridProps) {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statCards.map((card) => (
        <div key={card.key} className="glass-card p-4 gradient-border">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${card.bg}`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
          </div>
          <p className="text-2xl font-bold text-white">
            {(stats as any)[card.key] ?? 0}
          </p>
          <p className="text-xs text-safety-muted mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
