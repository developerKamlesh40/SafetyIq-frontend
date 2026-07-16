import { Clock, AlertTriangle, Radio, Camera, Shield, Wrench } from 'lucide-react';

const iconMap: Record<string, any> = {
  sensor_alarm: Radio, risk_escalation: AlertTriangle, incident: Shield,
  camera_event: Camera, permit: Wrench, emergency: AlertTriangle,
};

const colorMap: Record<string, string> = {
  critical: 'text-safety-red bg-safety-red/10',
  high: 'text-safety-amber bg-safety-amber/10',
  medium: 'text-safety-cyan bg-safety-cyan/10',
  low: 'text-safety-muted bg-safety-card',
};

interface LiveActivityFeedProps {
  feed: any[];
  isLoading: boolean;
}

export default function LiveActivityFeed({ feed = [], isLoading }: LiveActivityFeedProps) {
  return (
    <div className="glass-card p-6 gradient-border h-full max-h-80 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-safety-muted">Live Activity Feed</h3>
        <span className="text-xs text-safety-muted">{feed.length} events</span>
      </div>
      <div className="space-y-2">
        {isLoading && <p className="text-xs text-safety-muted">Loading...</p>}
        {feed.map((item: any) => {
          const Icon = iconMap[item.type] || AlertTriangle;
          const colors = colorMap[item.severity] || colorMap.low;
          return (
            <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg bg-safety-card/50">
              <div className={`p-1.5 rounded-full ${colors} flex-shrink-0`}>
                <Icon className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-safety-text truncate">{item.message}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-safety-muted">{item.zone}</span>
                  <span className="text-xs text-safety-muted">·</span>
                  <Clock className="w-3 h-3 text-safety-muted" />
                  <span className="text-xs text-safety-muted">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        {!isLoading && feed.length === 0 && (
          <p className="text-xs text-safety-muted text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
}
