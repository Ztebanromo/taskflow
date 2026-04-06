import React from 'react';
import { cn } from '../../../shared/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-[var(--accent)] text-white hover:opacity-90 active:scale-95 shadow-lg shadow-[rgba(124,106,247,0.25)]',
    ghost:
      'bg-transparent text-[var(--muted)] hover:bg-white/5 hover:text-[var(--text)] active:scale-95',
    danger:
      'bg-[var(--red)]/20 text-[var(--red)] hover:bg-[var(--red)]/30 border border-[var(--red)]/30 active:scale-95',
    outline:
      'bg-transparent border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] active:scale-95',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
  };

  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
};
