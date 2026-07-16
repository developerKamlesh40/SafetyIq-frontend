import { cn } from '@/lib/utils';
import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, ...props }, ref) => (
    <div>
      {label && <label className="block text-sm text-safety-muted mb-1.5">{label}</label>}
      <select
        ref={ref}
        className={cn(
          'w-full bg-safety-card border border-safety-border rounded-lg px-3 py-2 text-sm text-white placeholder-safety-muted focus:outline-none focus:border-safety-cyan/50 appearance-none cursor-pointer',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
);
Select.displayName = 'Select';
