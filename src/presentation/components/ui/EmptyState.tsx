import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';

interface EmptyStateProps {
  onAdd: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onAdd }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center gap-4 py-20 text-center"
    >
      <div className="text-6xl select-none" role="img" aria-label="clipboard">
        📋
      </div>
      <div>
        <p className="text-lg font-semibold text-[var(--text)]">Sin tareas pendientes</p>
        <p className="text-sm text-[var(--muted)] mt-1">
          Presiona{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 font-mono text-xs">
            N
          </kbd>{' '}
          para agregar tu primera tarea
        </p>
      </div>
      <Button variant="primary" size="md" onClick={onAdd}>
        ＋ Nueva tarea
      </Button>
    </motion.div>
  );
};
