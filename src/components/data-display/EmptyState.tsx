import { cn } from '@/lib/utils';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title = 'No data', description = 'Nothing to show here yet', icon, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 text-center', className)}>
      <div className="p-4 rounded-full bg-safety-card mb-4">
        {icon || <Inbox className="w-8 h-8 text-safety-muted" />}
      </div>
      <h3 className="text-sm font-medium text-safety-text mb-1">{title}</h3>
      <p className="text-xs text-safety-muted max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
