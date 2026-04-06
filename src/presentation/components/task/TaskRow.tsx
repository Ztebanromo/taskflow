import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../../domain/entities/Task';
import { TaskIcon } from './TaskIcon';
import { TaskCheckmark } from './TaskCheckmark';
import { PriorityDot } from './PriorityDot';
import { formatShortDate } from '../../../shared/utils/date';

interface TaskRowProps {
  task: Task;
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  index?: number;
}

export const TaskRow: React.FC<TaskRowProps> = ({
  task,
  onComplete,
  onEdit,
  onDelete,
  index = 0,
}) => {
  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -15 }}
        transition={{ duration: 0.25, delay: index * 0.03 }}
        onClick={() => onEdit(task)}
        className="group flex items-center gap-4 px-5 py-4 border-b border-[var(--border)] last:border-b-0 cursor-pointer hover:bg-white/[0.03] transition-all duration-200 relative glass-glow"
        style={{ minHeight: 72 }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onEdit(task);
        }}
        id={`task-row-${task.id}`}
      >
        {/* Icon */}
        <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
          <TaskIcon emoji={task.icon} size={40} />
        </div>

        {/* Task info */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <p className="text-[15px] font-semibold text-[var(--text)] truncate leading-tight tracking-tight">
              {task.title}
            </p>
            {task.autoRenew && (
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-[var(--green)] shadow-[0_0_8px_rgba(74,222,128,0.5)]"
              />
            )}
          </div>
          {task.subtitle && (
            <p className="text-[13px] text-[var(--muted)] truncate mt-1 leading-normal opacity-90">{task.subtitle}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            {task.category && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                {task.category}
              </span>
            )}
            {task.dueDate && (
              <div className="flex items-center gap-1 text-[11px] text-[var(--muted)] font-medium">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM11 9.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM8 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM8 9.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM5 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zM5 9.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
                  <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
                </svg>
                {formatShortDate(task.dueDate)}
              </div>
            )}
          </div>
        </div>

        {/* Priority dot */}
        <div className="shrink-0 group-hover:scale-125 transition-transform">
          <PriorityDot priority={task.priority} />
        </div>

        {/* Checkmark */}
        <TaskCheckmark
          completed={task.completed}
          onClick={() => onComplete(task.id)}
          id={`checkmark-${task.id}`}
        />

        {/* Delete on hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          id={`delete-${task.id}`}
          aria-label="Eliminar tarea"
          className="absolute right-14 opacity-0 lg:group-hover:opacity-100 transition-all duration-200 p-2 rounded-xl hover:bg-[var(--red)]/10 text-[var(--muted)] hover:text-[var(--red)]"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Z"/>
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
