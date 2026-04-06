import React from 'react';
import { Task } from '../../../domain/entities/Task';
import { TaskIcon } from '../task/TaskIcon';
import { TaskCheckmark } from '../task/TaskCheckmark';
import { formatShortDate } from '../../../shared/utils/date';

interface CompletedRowProps {
  task: Task;
  onUndo: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CompletedRow: React.FC<CompletedRowProps> = ({ task, onUndo, onDelete }) => {
  return (
    <div
      className="group flex items-center gap-3 px-4 py-2.5 border-b border-[var(--border)] last:border-b-0 opacity-60 hover:opacity-80 transition-opacity"
      id={`completed-row-${task.id}`}
    >
      <TaskIcon emoji={task.icon} size={30} />

      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--muted)] truncate line-through">{task.title}</p>
        {task.completedAt && (
          <p className="text-[10px] text-[var(--muted)]/60 mt-0.5">
            Completada el {formatShortDate(task.completedAt)}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <TaskCheckmark
          completed
          onClick={() => onUndo(task.id)}
          id={`undo-checkmark-${task.id}`}
        />
        <button
          onClick={() => onDelete(task.id)}
          id={`delete-completed-${task.id}`}
          aria-label="Eliminar tarea completada"
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[var(--red)]/15 text-[var(--muted)] hover:text-[var(--red)]"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
