import { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { X, AlertTriangle, CheckCircle, Info, AlertOctagon } from 'lucide-react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

const icons = { success: CheckCircle, error: AlertOctagon, warning: AlertTriangle, info: Info };
const colors = { success: 'border-safety-green/30 bg-safety-green/10', error: 'border-safety-red/30 bg-safety-red/10', warning: 'border-safety-amber/30 bg-safety-amber/10', info: 'border-safety-cyan/30 bg-safety-cyan/10' };
const iconColors = { success: 'text-safety-green', error: 'text-safety-red', warning: 'text-safety-amber', info: 'text-safety-cyan' };

let addToastFn: (t: Omit<Toast, 'id'>) => void;

export function toast(t: Omit<Toast, 'id'>) {
  addToastFn?.(t);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
  }, []);

  useEffect(() => { addToastFn = addToast; }, [addToast]);

  const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={() => remove(t.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const Icon = icons[t.type];
  useEffect(() => {
    const timer = setTimeout(onDismiss, t.duration || 5000);
    return () => clearTimeout(timer);
  }, [t.duration, onDismiss]);

  return (
    <div className={cn('flex items-start gap-3 p-3 rounded-lg border backdrop-blur-md animate-slide-up', colors[t.type])}>
      <Icon className={cn('w-4 h-4 mt-0.5 flex-shrink-0', iconColors[t.type])} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-safety-text">{t.title}</p>
        {t.message && <p className="text-xs text-safety-muted mt-0.5">{t.message}</p>}
      </div>
      <button onClick={onDismiss} className="text-safety-muted hover:text-white flex-shrink-0">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
