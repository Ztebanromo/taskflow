import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../../domain/entities/Task';
import { TaskRow } from './TaskRow';
import { MAX_TASKS_VISIBLE } from '../../../shared/constants/app.constants';

interface TaskCardProps {
  title: string;
  tasks: Task[];
  onComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onExport?: () => void;
  onImport?: (tasks: Task[]) => void;
  onClearCompleted?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  title,
  tasks,
  onComplete,
  onEdit,
  onDelete,
  onExport,
  onImport,
  onClearCompleted,
}) => {
  const [showAll, setShowAll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const visible = showAll ? tasks : tasks.slice(0, MAX_TASKS_VISIBLE);
  const hasMore = tasks.length > MAX_TASKS_VISIBLE;

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string) as Task[];
        const tasks = json.map((t) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          completedAt: t.completedAt ? new Date(t.completedAt) : undefined,
          dueDate: t.dueDate ? new Date(t.dueDate) : undefined,
        }));
        onImport?.(tasks);
      } catch {
        alert('Error al importar: JSON inválido');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="card relative transition-all duration-300 glass-glow" id="task-card-main">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border)] overflow-visible">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 rounded-full bg-[var(--accent)]" />
          <h2 className="font-brand text-xs font-bold text-[var(--muted)] uppercase tracking-[0.2em]">
            {title}
          </h2>
        </div>
        <div className="relative">
          <button
            id="task-card-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            className="p-2 rounded-xl hover:bg-white/5 text-[var(--muted)] hover:text-[var(--text)] transition-all active:scale-90"
            aria-label="Opciones"
            aria-expanded={menuOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="1"></circle>
              <circle cx="12" cy="5" r="1"></circle>
              <circle cx="12" cy="19" r="1"></circle>
            </svg>
          </button>
          
          <AnimatePresence>
            {menuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 z-20 card2 min-w-[210px] py-2 shadow-2xl backdrop-blur-xl border-white/10"
                  role="menu"
                >
                  <button
                    onClick={() => { onExport?.(); setMenuOpen(false); }}
                    className="w-full text-left px-5 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--accent)]/10 transition-colors flex items-center gap-3"
                    role="menuitem"
                    id="export-json-btn"
                  >
                    <span className="opacity-70">📤</span> Exportar Datos
                  </button>
                  <button
                    onClick={() => { fileInputRef.current?.click(); setMenuOpen(false); }}
                    className="w-full text-left px-5 py-2.5 text-[13px] text-[var(--text)] hover:bg-[var(--accent)]/10 transition-colors flex items-center gap-3"
                    role="menuitem"
                    id="import-json-btn"
                  >
                    <span className="opacity-70">📥</span> Importar Datos
                  </button>
                  <div className="h-px bg-[var(--border)] my-2" />
                  <button
                    onClick={() => { onClearCompleted?.(); setMenuOpen(false); }}
                    className="w-full text-left px-5 py-2.5 text-[13px] text-[var(--red)] hover:bg-[var(--red)]/10 transition-colors flex items-center gap-3"
                    role="menuitem"
                    id="clear-completed-btn"
                  >
                    <span className="opacity-70">🗑</span> Limpiar Historial
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
        id="import-file-input"
      />

      {/* Task list */}
      <div className="divide-y divide-[var(--border)]">
        {visible.length > 0 ? (
          visible.map((task, idx) => (
            <TaskRow
              key={task.id}
              task={task}
              index={idx}
              onComplete={onComplete}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="py-12 text-center">
            <p className="text-sm text-[var(--muted)]">No hay tareas en esta vista</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {hasMore && (
        <div className="px-6 py-4 border-t border-[var(--border)] flex justify-center">
          <button
            onClick={() => setShowAll((v) => !v)}
            id="show-more-btn"
            className="group flex items-center gap-2 text-[13px] font-semibold text-[var(--accent)] hover:text-[var(--accent)]/80 transition-colors"
          >
            {showAll ? 'Mostrar menos tareas' : `Mostrar todas las tareas (+${tasks.length - MAX_TASKS_VISIBLE})`}
            <motion.span 
              animate={{ x: showAll ? -2 : 2 }} 
              transition={{ repeat: Infinity, duration: 0.8, repeatType: 'reverse' }}
            >
              {showAll ? '↑' : '↓'}
            </motion.span>
          </button>
        </div>
      )}
    </div>
  );
};

