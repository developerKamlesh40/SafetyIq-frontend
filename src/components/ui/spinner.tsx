import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 16, className }: SpinnerProps) {
  return <Loader2 className={cn('animate-spin text-safety-cyan', className)} style={{ width: size, height: size }} />;
}
