import { cn } from '@/lib/utils';

interface PulseGlowProps {
  children: React.ReactNode;
  active?: boolean;
  color?: 'red' | 'cyan' | 'amber';
  className?: string;
}

const glowColors = {
  red: 'shadow-[0_0_10px_rgba(255,59,59,0.3)]',
  cyan: 'shadow-[0_0_10px_rgba(0,212,255,0.3)]',
  amber: 'shadow-[0_0_10px_rgba(255,149,0,0.3)]',
};

export function PulseGlow({ children, active = true, color = 'red', className }: PulseGlowProps) {
  return (
    <div className={cn(active && `animate-pulse-glow ${glowColors[color]}`, className)}>
      {children}
    </div>
  );
}
