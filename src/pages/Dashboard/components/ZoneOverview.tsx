import { MapPin } from 'lucide-react';

interface ZoneOverviewProps {
  distribution: Array<{ zone_id: number; zone_name: string; worker_count: number }>;
}

export default function ZoneOverview({ distribution = [] }: ZoneOverviewProps) {
  return (
    <div className="glass-card p-6 gradient-border">
      <h3 className="text-sm font-medium text-safety-muted mb-4">Worker Distribution</h3>
      <div className="space-y-3">
        {distribution.map((zone) => (
          <div key={zone.zone_id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-safety-cyan" />
              <span className="text-sm text-safety-text">{zone.zone_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-24 h-1.5 bg-safety-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-safety-cyan rounded-full transition-all"
                  style={{ width: `${Math.min(100, (zone.worker_count / 20) * 100)}%` }}
                />
              </div>
              <span className="text-sm text-safety-muted w-6 text-right">{zone.worker_count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
