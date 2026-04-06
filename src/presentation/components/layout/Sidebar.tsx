import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '../../../domain/entities/Task';
import { Priority } from '../../../domain/enums/Priority';
import { FilterView, TaskStats, CategoryItem } from '../../../shared/types/global.types';
import { ProgressBar } from '../ui/ProgressBar';
import { cn } from '../../../shared/utils/cn';
import { isToday } from '../../../shared/utils/date';
import { generateUUID } from '../../../shared/utils/uuid';

interface SidebarProps {
  tasks: Task[];
  categories: CategoryItem[];
  stats: TaskStats;
  activeFilter: FilterView;
  onFilterChange: (filter: FilterView) => void;
  onAddTask: () => void;
  onAddCategory: (cat: CategoryItem) => void;
  onDeleteCategory: (id: string) => void;
}

type NavItem = { id: FilterView; label: string; icon: string };

const NAV_ITEMS: NavItem[] = [
  { id: 'all',       label: 'Todas',         icon: '📋' },
  { id: 'high',      label: 'Alta prioridad', icon: '🔥' },
  { id: 'today',     label: 'Hoy',            icon: '📅' },
  { id: 'automated', label: 'Automatizadas',  icon: '⚡' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  tasks,
  categories,
  stats,
  activeFilter,
  onFilterChange,
  onAddTask,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [isAddingCat, setIsAddingCat] = useState(false);

  const getCategoryCount = (catName: string) => 
    tasks.filter((t) => t.category === catName && !t.completed).length;

  const highCount    = tasks.filter((t) => t.priority === Priority.HIGH && !t.completed).length;
  const todayCount   = tasks.filter((t) => t.dueDate && isToday(t.dueDate) && !t.completed).length;
  const autoCount    = tasks.filter((t) => t.autoRenew && !t.completed).length;
  const totalPending = tasks.filter((t) => !t.completed).length;

  const getCount = (filter: FilterView) => {
    if (filter === 'all')       return totalPending;
    if (filter === 'high')      return highCount;
    if (filter === 'today')     return todayCount;
    if (filter === 'automated') return autoCount;
    return 0;
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    
    const colors = ['#7c6af7', '#f76a8a', '#4ade80', '#fbbf24', '#f87171', '#38bdf8', '#a855f7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    onAddCategory({
      id: generateUUID(),
      name: newCatName.trim(),
      color: randomColor,
      isDefault: false
    });
    setNewCatName('');
    setIsAddingCat(false);
  };

  return (
    <aside
      className="flex flex-col h-full bg-[var(--card)] border-r border-[var(--border)] overflow-y-auto"
      id="sidebar"
      style={{ width: 'var(--sidebar-width)' }}
    >
      {/* Brand header */}
      <div className="px-6 py-8 border-b border-[var(--border)]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent2)] flex items-center justify-center text-lg shadow-lg shadow-[var(--accent)]/20">
            ⚡
          </div>
          <span className="font-brand text-2xl font-bold bg-gradient-to-r from-[var(--accent)] to-[var(--accent2)] bg-clip-text text-transparent">
            TaskFlow
          </span>
        </motion.div>
      </div>

      {/* Add task button */}
      <div className="px-6 pt-6">
        <button
          onClick={onAddTask}
          id="sidebar-add-task-btn"
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-[var(--accent)] text-white text-sm font-semibold shadow-lg shadow-[var(--accent)]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="3" x2="8" y2="13"></line>
            <line x1="3" y1="8" x2="13" y2="8"></line>
          </svg>
          Nueva tarea
          <kbd className="ml-2 px-1.5 py-0.5 rounded-lg bg-white/20 font-mono text-[10px] opacity-80">N</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="px-4 mt-8 flex flex-col gap-1.5" aria-label="Filtros de vista">
        <p className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.15em] mb-3 px-3">
          Vistas
        </p>
        {NAV_ITEMS.map((item) => {
          const count = getCount(item.id);
          const isActive = activeFilter === item.id;
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => onFilterChange(item.id)}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] transition-all duration-200 group relative',
                isActive
                  ? 'bg-[var(--accent)]/10 text-[var(--text)] font-semibold'
                  : 'text-[var(--muted)] hover:bg-white/[0.04] hover:text-[var(--text)]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute left-0 w-1 h-5 bg-[var(--accent)] rounded-full"
                />
              )}
              <span className="text-lg opacity-90" aria-hidden="true">{item.icon}</span>
              <span className="flex-1 ml-1">{item.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-lg font-bold min-w-[20px] text-center',
                    isActive
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-white/10 text-[var(--muted)]'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Categories */}
      <div className="px-4 mt-10 flex flex-col gap-1.5">
        <div className="flex items-center justify-between mb-3 px-3">
          <p className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.15em]">
            Categorías
          </p>
          <button 
            onClick={() => setIsAddingCat(!isAddingCat)}
            className="p-1 rounded-lg hover:bg-white/5 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isAddingCat && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleAddCategory}
              className="px-3 mb-2"
            >
              <input
                autoFocus
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nombre..."
                className="w-full text-xs py-2 px-3 rounded-lg border-dashed border-[var(--border)] focus:border-[var(--accent)]"
              />
            </motion.form>
          )}
        </AnimatePresence>

        {categories.map((cat) => {
          const count = getCategoryCount(cat.name);
          return (
            <div
              key={cat.id}
              className="group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[14px] text-[var(--muted)] hover:bg-white/[0.04] transition-all duration-200"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                style={{ backgroundColor: cat.color }} 
              />
              <span className="flex-1 text-[var(--muted)] group-hover:text-[var(--text)] transition-colors">{cat.name}</span>
              {count > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/10 font-bold">
                  {count}
                </span>
              )}
              {!cat.isDefault && (
                <button
                  onClick={() => onDeleteCategory(cat.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[var(--red)]/10 hover:text-[var(--red)] transition-all"
                >
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.646a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats card */}
      <div className="mt-auto px-6 pb-8">
        <div className="card2 p-5 bg-gradient-to-br from-[var(--card2)] to-[var(--bg)] shadow-inner">
          <div className="flex items-end justify-between mb-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-wider mb-1">
                Progreso Diario
              </span>
              <span className="font-brand text-2xl font-bold text-[var(--text)]">
                {stats.percentage}%
              </span>
            </div>
          </div>
          <ProgressBar value={stats.percentage} />
          <p className="text-[11px] text-[var(--muted)] mt-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)]"></span>
            {stats.completedToday} de {stats.totalToday || stats.total} tareas hoy
          </p>
        </div>
      </div>
    </aside>
  );
};
