import React from 'react';
import { Priority } from '../../../domain/enums/Priority';
import { cn } from '../../../shared/utils/cn';

interface PriorityDotProps {
  priority: Priority;
}

const priorityConfig: Record<Priority, { color: string; label: string }> = {
  [Priority.HIGH]:   { color: 'bg-[var(--red)]',    label: 'Alta' },
  [Priority.MEDIUM]: { color: 'bg-[var(--yellow)]', label: 'Media' },
  [Priority.LOW]:    { color: 'bg-[var(--green)]',  label: 'Baja' },
};

export const PriorityDot: React.FC<PriorityDotProps> = ({ priority }) => {
  const { color, label } = priorityConfig[priority];
  return (
    <span
      title={`Prioridad: ${label}`}
      className={cn('w-2 h-2 rounded-full shrink-0', color)}
      aria-label={`Prioridad ${label}`}
    />
  );
};
