import React from 'react';
import { cn } from '../../../shared/utils/cn';

interface BadgeProps {
  label: string;
  color?: 'accent' | 'accent2' | 'green' | 'yellow' | 'red' | 'muted';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ label, color = 'accent', className }) => {
  const colors = {
    accent:  'bg-[var(--accent)]/15  text-[var(--accent)]',
    accent2: 'bg-[var(--accent2)]/15 text-[var(--accent2)]',
    green:   'bg-[var(--green)]/15   text-[var(--green)]',
    yellow:  'bg-[var(--yellow)]/15  text-[var(--yellow)]',
    red:     'bg-[var(--red)]/15     text-[var(--red)]',
    muted:   'bg-white/5             text-[var(--muted)]',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colors[color],
        className
      )}
    >
      {label}
    </span>
  );
};
