import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div>
      {label && <label className="block text-sm text-safety-muted mb-1.5">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full bg-safety-card border rounded-lg px-3 py-2.5 text-sm text-white placeholder-safety-muted focus:outline-none transition-colors',
          error ? 'border-safety-red' : 'border-safety-border focus:border-safety-cyan/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-safety-red mt-1">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';
