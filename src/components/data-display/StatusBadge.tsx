import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

const colors: Record<string, string> = {
  normal: 'bg-safety-green/20 text-safety-green',
  ok: 'bg-safety-green/20 text-safety-green',
  active: 'bg-safety-green/20 text-safety-green',
  approved: 'bg-safety-green/20 text-safety-green',
  completed: 'bg-safety-green/20 text-safety-green',
  resolved: 'bg-safety-green/20 text-safety-green',
  on_site: 'bg-safety-green/20 text-safety-green',
  day: 'bg-safety-cyan/20 text-safety-cyan',
  warning: 'bg-safety-amber/20 text-safety-amber',
  danger: 'bg-orange-500/20 text-orange-400',
  high: 'bg-orange-500/20 text-orange-400',
  suspended: 'bg-safety-amber/20 text-safety-amber',
  pending: 'bg-safety-amber/20 text-safety-amber',
  critical: 'bg-safety-red/20 text-safety-red',
  danger_critical: 'bg-safety-red/20 text-safety-red',
  investigating: 'bg-safety-amber/20 text-safety-amber',
  open: 'bg-safety-cyan/20 text-safety-cyan',
  scheduled: 'bg-safety-cyan/20 text-safety-cyan',
  in_progress: 'bg-safety-cyan/20 text-safety-cyan',
  off_site: 'bg-safety-card text-safety-muted',
  cancelled: 'bg-safety-card text-safety-muted',
  expired: 'bg-safety-card text-safety-muted',
};

export function StatusBadge({ status, size = 'md', pulse, className }: StatusBadgeProps) {
  const key = status?.toLowerCase().replace(/\s+/g, '_') || 'normal';
  const colorClass = colors[key] || 'bg-safety-card text-safety-muted';

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border border-transparent font-medium capitalize',
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
      colorClass,
      pulse && 'animate-pulse-glow',
      className
    )}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {status?.replace(/_/g, ' ') || 'Unknown'}
    </span>
  );
}
