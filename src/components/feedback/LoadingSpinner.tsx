import { cn } from '@/lib/utils';
import { Spinner } from '@/components/ui/spinner';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
  fullPage?: boolean;
}

export function LoadingSpinner({ text = 'Loading...', className, fullPage }: LoadingSpinnerProps) {
  return (
    <div className={cn(
      'flex flex-col items-center justify-center gap-3',
      fullPage ? 'h-[calc(100vh-8rem)]' : 'py-12',
      className
    )}>
      <Spinner size={24} />
      <p className="text-sm text-safety-muted">{text}</p>
    </div>
  );
}
