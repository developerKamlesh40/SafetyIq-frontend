import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical' | 'info';
  onClick?: () => void;
  className?: string;
}

const borderColors: Record<string, string> = {
  low: 'border-safety-green/30', medium: 'border-safety-amber/30', high: 'border-orange-500/30', critical: 'border-safety-red/30', info: 'border-safety-cyan/30',
};

export function MetricCard({ title, value, unit, icon, trend, trendValue, severity = 'info', onClick, className }: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-safety-green' : trend === 'down' ? 'text-safety-red' : 'text-safety-muted';

  return (
    <div
      onClick={onClick}
      className={cn('glass-card p-4 gradient-border border-l-2 cursor-pointer hover:bg-safety-card/80 transition-all', borderColors[severity], onClick && 'cursor-pointer', className)}
    >
      <div className="flex items-center justify-between mb-3">
        {icon && <div className="p-2 rounded-lg bg-safety-card">{icon}</div>}
        {trend && (
          <div className={cn('flex items-center gap-1 text-xs', trendColor)}>
            <TrendIcon className="w-3 h-3" />
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-white">{value ?? '--'}</span>
        {unit && <span className="text-xs text-safety-muted">{unit}</span>}
      </div>
      <p className="text-xs text-safety-muted mt-1">{title}</p>
    </div>
  );
}
