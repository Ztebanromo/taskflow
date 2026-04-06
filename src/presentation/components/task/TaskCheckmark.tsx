import React from 'react';
import { motion } from 'framer-motion';

interface TaskCheckmarkProps {
  completed: boolean;
  onClick: () => void;
  id?: string;
}

export const TaskCheckmark: React.FC<TaskCheckmarkProps> = ({ completed, onClick, id }) => {
  return (
    <motion.button
      id={id}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-pressed={completed}
      aria-label={completed ? 'Desmarcar como completada' : 'Marcar como completada'}
      whileTap={{ scale: 0.85 }}
      className="relative w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={{
        borderColor: completed ? 'var(--green)' : 'rgba(255,255,255,0.15)',
        backgroundColor: completed ? 'rgba(74,222,128,0.15)' : 'transparent',
      }}
    >
      {completed && (
        <motion.svg
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M2.5 7L5.5 10L11.5 4"
            stroke="var(--green)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      )}
    </motion.button>
  );
};
