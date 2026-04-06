import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../../domain/entities/Task';
import { CompletedRow } from './CompletedRow';

interface CompletedPanelProps {
  tasks: Task[];
  onUndo: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CompletedPanel: React.FC<CompletedPanelProps> = ({ tasks, onUndo, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  if (tasks.length === 0) return null;

  return (
    <div className="card mt-4" id="completed-panel">
      {/* Collapsible header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        id="completed-panel-toggle"
        aria-expanded={expanded}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-brand text-sm font-bold text-[var(--muted)] uppercase tracking-wide">
            Completadas
          </span>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--green)]/15 text-[var(--green)] text-[10px] font-bold">
            {tasks.length}
          </span>
        </div>
        <motion.svg
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="text-[var(--muted)]"
          aria-hidden="true"
        >
          <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </motion.svg>
      </button>

      {/* Animated list */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="completed-list"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div className="border-t border-[var(--border)]">
              {tasks.map((task) => (
                <CompletedRow key={task.id} task={task} onUndo={onUndo} onDelete={onDelete} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
