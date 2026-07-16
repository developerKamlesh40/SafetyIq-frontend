import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimelineEvent {
  id: number | string;
  time: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  severity?: 'low' | 'medium' | 'high' | 'critical' | 'info';
  details?: { label: string; value: string }[];
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const dotColors: Record<string, string> = {
  low: 'bg-safety-green', medium: 'bg-safety-amber', high: 'bg-orange-500', critical: 'bg-safety-red', info: 'bg-safety-cyan',
};

export function Timeline({ events, className }: TimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, i) => (
        <div key={event.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < events.length - 1 && <div className="absolute left-[11px] top-5 bottom-0 w-px bg-safety-border" />}
          <div className={cn('w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5', dotColors[event.severity || 'info'])}>
            {event.icon || <div className="w-2 h-2 rounded-full bg-white" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm font-medium text-white">{event.title}</span>
              <span className="text-xs text-safety-muted flex items-center gap-1">
                <Clock className="w-3 h-3" /> {event.time}
              </span>
            </div>
            {event.description && <p className="text-xs text-safety-muted">{event.description}</p>}
            {event.details && (
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                {event.details.map((d, j) => (
                  <span key={j} className="text-xs text-safety-muted">{d.label}: <span className="text-safety-text">{d.value}</span></span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
