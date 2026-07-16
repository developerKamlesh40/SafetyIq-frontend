import { cn } from '@/lib/utils';
import { AlertTriangle, X, Bell, Zap, Shield } from 'lucide-react';

interface AlertPopupProps {
  type: 'emergency' | 'alert' | 'warning' | 'info';
  title: string;
  message: string;
  zone?: string;
  actions?: { label: string; onClick: () => void; variant?: 'primary' | 'danger' | 'ghost' }[];
  onDismiss?: () => void;
  open: boolean;
}

export function AlertPopup({ type, title, message, zone, actions, onDismiss, open }: AlertPopupProps) {
  if (!open) return null;

  const isCritical = type === 'emergency';
  const Icon = isCritical ? Zap : type === 'warning' ? AlertTriangle : type === 'alert' ? Bell : Shield;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className={cn(
        'relative w-full max-w-lg mx-4 p-6 rounded-xl border-2 animate-slide-up',
        isCritical ? 'bg-safety-red/10 border-safety-red shadow-[0_0_30px_rgba(255,59,59,0.3)]' :
        type === 'warning' ? 'bg-safety-amber/10 border-safety-amber' :
        'bg-safety-cyan/10 border-safety-cyan'
      )}>
        <div className="flex items-start gap-4">
          <div className={cn(
            'p-3 rounded-full flex-shrink-0',
            isCritical ? 'bg-safety-red/20 text-safety-red animate-pulse' :
            type === 'warning' ? 'bg-safety-amber/20 text-safety-amber' :
            'bg-safety-cyan/20 text-safety-cyan'
          )}>
            <Icon className="w-8 h-8" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h2 className={cn('text-lg font-bold', isCritical ? 'text-safety-red' : 'text-white')}>
                {title}
              </h2>
              {onDismiss && (
                <button onClick={onDismiss} className="text-safety-muted hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            {zone && <p className="text-sm text-safety-muted mb-1">Location: {zone}</p>}
            <p className="text-sm text-safety-text">{message}</p>
            {actions && actions.length > 0 && (
              <div className="flex gap-2 mt-4">
                {actions.map((action, i) => (
                  <button
                    key={i}
                    onClick={action.onClick}
                    className={cn(
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      action.variant === 'danger' ? 'bg-safety-red text-white hover:bg-safety-red/80' :
                      action.variant === 'ghost' ? 'text-safety-muted hover:text-white hover:bg-safety-card' :
                      'bg-safety-cyan/20 border border-safety-cyan/30 text-safety-cyan hover:bg-safety-cyan/30'
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
