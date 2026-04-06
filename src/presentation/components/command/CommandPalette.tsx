import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../../domain/entities/Task';
import { TaskIcon } from '../task/TaskIcon';
import { PriorityDot } from '../task/PriorityDot';

interface CommandPaletteProps {
  tasks: Task[];
  onClose: () => void;
  onSelectTask: (task: Task) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ tasks, onClose, onSelectTask }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.trim()
    ? tasks.filter((t) =>
        t.title.toLowerCase().includes(query.toLowerCase()) ||
        t.subtitle?.toLowerCase().includes(query.toLowerCase())
      )
    : tasks.slice(0, 8);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 overflow-hidden"
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        id="command-palette-overlay"
      >
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="card w-full max-w-xl overflow-hidden glass-glow shadow-2xl border-white/10"
          id="command-palette"
        >
          {/* Search input section */}
          <div className="flex items-center gap-4 px-6 py-5 border-b border-[var(--border)] bg-white/[0.02]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-[var(--muted)] shrink-0 opacity-70"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              ref={inputRef}
              id="command-palette-input"
              type="text"
              placeholder="Buscar tareas por título o descripción..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-[16px] font-medium text-[var(--text)] placeholder:text-[var(--muted)] placeholder:font-normal"
              style={{ padding: 0 }}
            />
            <div className="flex items-center gap-1.5 shrink-0">
               <kbd className="px-1.5 py-1 rounded-lg bg-white/5 border border-white/10 font-mono text-[10px] text-[var(--muted)] uppercase font-bold tracking-tighter">
                Esc
              </kbd>
            </div>
          </div>

          {/* Results section */}
          <div className="max-h-[420px] overflow-y-auto divide-y divide-[var(--border)]">
            {filtered.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <p className="text-[14px] text-[var(--muted)]">No se encontraron tareas para "<span className="text-[var(--text)] font-semibold">{query}</span>"</p>
                <p className="text-[11px] text-[var(--muted)] mt-2 uppercase tracking-widest font-bold opacity-60">Prueba con otras palabras clave</p>
              </div>
            ) : (
              <div className="flex flex-col">
                <p className="px-6 py-3 text-[10px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] bg-white/[0.01]">
                  {query ? 'Resultados de búsqueda' : 'Sugerencias recientes'}
                </p>
                {filtered.map((task) => (
                  <button
                    key={task.id}
                    id={`palette-item-${task.id}`}
                    onClick={() => { onSelectTask(task); onClose(); }}
                    className="w-full flex items-center gap-4 px-6 py-4 hover:bg-[var(--accent)]/5 transition-all group border-l-2 border-l-transparent hover:border-l-[var(--accent)]"
                  >
                    <div className="shrink-0 transition-transform group-hover:scale-110">
                      <TaskIcon emoji={task.icon} size={36} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-[15px] font-semibold truncate leading-snug tracking-tight ${
                          task.completed ? 'line-through text-[var(--muted)] opacity-50' : 'text-[var(--text)] group-hover:text-[var(--accent)] transition-colors'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.subtitle && (
                        <p className="text-[13px] text-[var(--muted)] truncate mt-0.5 opacity-80 group-hover:opacity-100">{task.subtitle}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <PriorityDot priority={task.priority} />
                      {task.completed && (
                        <div className="w-5 h-5 rounded-full bg-[var(--green)]/20 flex items-center justify-center text-[var(--green)] text-[10px] font-bold">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer section */}
          <div className="px-6 py-4 border-t border-[var(--border)] bg-white/[0.01] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
              {filtered.length} tarea{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 font-medium">
                <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/5 font-mono text-[10px]">Enter</kbd>
                Abrir
              </span>
              <span className="text-[11px] text-[var(--muted)] flex items-center gap-1.5 font-medium">
                <kbd className="px-1.5 py-0.5 rounded-md bg-white/10 border border-white/5 font-mono text-[10px]">↑↓</kbd>
                Navegar
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
