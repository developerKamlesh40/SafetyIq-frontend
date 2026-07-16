import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'low' | 'medium' | 'high' | 'critical' | 'success' | 'warning' | 'info';
  children: React.ReactNode;
  className?: string;
  pulse?: boolean;
  size?: 'sm' | 'md';
}

const colors: Record<string, string> = {
  low: 'bg-safety-green/20 text-safety-green border-safety-green/30',
  medium: 'bg-safety-amber/20 text-safety-amber border-safety-amber/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  critical: 'bg-safety-red/20 text-safety-red border-safety-red/30',
  success: 'bg-safety-green/20 text-safety-green border-safety-green/30',
  warning: 'bg-safety-amber/20 text-safety-amber border-safety-amber/30',
  info: 'bg-safety-cyan/20 text-safety-cyan border-safety-cyan/30',
};

export function Badge({ variant = 'info', children, className, pulse, size = 'md' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-medium capitalize',
      size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs',
      colors[variant],
      pulse && 'animate-pulse-glow',
      className
    )}>
      {pulse && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
      {children}
    </span>
  );
}
