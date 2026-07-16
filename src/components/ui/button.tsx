import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const variants = {
  primary: 'bg-safety-cyan/20 border border-safety-cyan/30 text-safety-cyan hover:bg-safety-cyan/30',
  secondary: 'bg-safety-card border border-safety-border text-safety-text hover:bg-safety-card/80',
  danger: 'bg-safety-red/20 border border-safety-red/30 text-safety-red hover:bg-safety-red/30',
  ghost: 'text-safety-muted hover:text-safety-text hover:bg-safety-card/50',
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-2.5 text-sm',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn('rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2', variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = 'Button';
