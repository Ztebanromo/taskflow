import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useTaskManager } from '../../application/hooks/useTaskManager';
import { useToast } from '../components/ui/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';
import { Task } from '../../domain/entities/Task';
import { CreateTaskDTO } from '../../application/dtos/CreateTaskDTO';
import { EditTaskDTO } from '../../application/dtos/EditTaskDTO';
import { Priority } from '../../domain/enums/Priority';
import { FilterView, TaskStats } from '../../shared/types/global.types';

import { MainLayout } from '../components/layout/MainLayout';
import { Sidebar } from '../components/layout/Sidebar';
import { TaskCard } from '../components/task/TaskCard';
import { CompletedPanel } from '../components/completed/CompletedPanel';
import { AddTaskModal } from '../components/modal/AddTaskModal';
import { CommandPalette } from '../components/command/CommandPalette';
import { EmptyState } from '../components/ui/EmptyState';
import { KeyboardHint } from '../components/ui/KeyboardHint';
import { isToday } from '../../shared/utils/date';

export const HomePage: React.FC = () => {
  const { showToast } = useToast();
  const {
    tasks,
    categories,
    addTask,
    completeTask,
    undoComplete,
    deleteTask,
    editTask,
    clearCompleted,
    importTasks,
    exportTasks,
    addCategory,
    deleteCategory,
    duplicateTask,
  } = useTaskManager();

  const [activeFilter, setActiveFilter] = useState<FilterView>('all');
  const [showModal, setShowModal] = useState(false);
  const [showPalette, setShowPalette] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // ── Keyboard shortcuts ────────────────────────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName.toLowerCase();
      const isInput = tag === 'input' || tag === 'textarea' || tag === 'select';

      if (e.key === 'Escape') {
        setShowModal(false);
        setShowPalette(false);
        setEditingTask(null);
        return;
      }

      if (isInput) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingTask(null);
        setShowModal(true);
      }

      if (e.key === '/') {
        e.preventDefault();
        setShowPalette(true);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // ── Filters ───────────────────────────────────────────────────────────────
  const pendingTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((t) => t.completed), [tasks]);

  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case 'high':
        return pendingTasks.filter((t) => t.priority === Priority.HIGH);
      case 'today':
        return pendingTasks.filter((t) => t.dueDate && isToday(t.dueDate));
      case 'automated':
        return pendingTasks.filter((t) => t.autoRenew);
      default:
        return pendingTasks;
    }
  }, [pendingTasks, activeFilter]);

  // ── Stats ─────────────────────────────────────────────────────────────────
  const stats: TaskStats = useMemo(() => {
    const totalToday = tasks.filter((t) => t.dueDate && isToday(t.dueDate)).length;
    const completedToday = tasks.filter(
      (t) => t.completed && t.completedAt && isToday(t.completedAt)
    ).length;
    const total = tasks.length;
    const completed = completedTasks.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, completedToday, totalToday, percentage };
  }, [tasks, completedTasks]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAddTask = useCallback((dto: CreateTaskDTO) => {
    addTask(dto);
    showToast('Tarea creada correctamente', 'success');
  }, [addTask, showToast]);

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  }, []);

  const handleEditTaskSave = useCallback((dto: EditTaskDTO) => {
    editTask(dto);
    showToast('Tarea actualizada', 'success');
  }, [editTask, showToast]);

  const handleDeleteTask = useCallback((id: string) => {
    deleteTask(id);
    showToast('Tarea eliminada', 'info');
  }, [deleteTask, showToast]);

  const handleClearCompleted = useCallback(() => {
    clearCompleted();
    showToast('Historial limpiado', 'info');
  }, [clearCompleted, showToast]);

  const handleCompleteTask = useCallback((id: string) => {
    completeTask(id);
    showToast('Tarea completada', 'success');
  }, [completeTask, showToast]);

  const handleUndoComplete = useCallback((id: string) => {
    undoComplete(id);
    showToast('Tarea restaurada', 'info');
  }, [undoComplete, showToast]);

  const handleDuplicateTask = useCallback((id: string) => {
    duplicateTask(id);
    showToast('Tarea duplicada', 'success');
  }, [duplicateTask, showToast]);

  const handlePaletteSelect = useCallback(
    (task: Task) => {
      handleEditTask(task);
    },
    [handleEditTask]
  );

  const handleModalClose = useCallback(() => {
    setShowModal(false);
    setEditingTask(null);
  }, []);

  // ── Section title ─────────────────────────────────────────────────────────
  const sectionTitle: Record<FilterView, string> = {
    all:       'Todas las tareas',
    high:      '🔥 Alta prioridad',
    today:     '📅 Vence hoy',
    automated: '⚡ Automatizadas',
  };

  return (
    <>
      <MainLayout
        sidebar={
          <Sidebar
            tasks={tasks}
            categories={categories}
            stats={stats}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onAddTask={() => { setEditingTask(null); setShowModal(true); }}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
        }
        content={
          <div className="max-w-2xl mx-auto">
            {/* Page header */}
            <div className="flex items-center justify-between mb-10">
              <div>
                <h1 className="font-brand text-3xl font-bold text-[var(--text)]">
                  {sectionTitle[activeFilter]}
                </h1>
                <p className="text-[14px] text-[var(--muted)] mt-1 font-medium italic opacity-80">
                  {filteredTasks.length} tarea{filteredTasks.length !== 1 ? 's' : ''} pendiente
                  {filteredTasks.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <KeyboardHint keys={['/']} label="Buscar" />
                <KeyboardHint keys={['N']} label="Nueva" />
              </div>
            </div>

            {/* Task card or empty state */}
            {filteredTasks.length === 0 ? (
              <EmptyState onAdd={() => { setEditingTask(null); setShowModal(true); }} />
            ) : (
              <TaskCard
                title={sectionTitle[activeFilter]}
                tasks={filteredTasks}
                onComplete={handleCompleteTask}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onDuplicate={handleDuplicateTask}
                onExport={exportTasks}
                onImport={importTasks}
                onClearCompleted={handleClearCompleted}
              />
            )}

            {/* Completed panel */}
            <CompletedPanel
              tasks={completedTasks}
              onUndo={handleUndoComplete}
              onDelete={handleDeleteTask}
            />
          </div>
        }
      />

      {/* Modals */}
      <AnimatePresence>
        {showModal && (
          <AddTaskModal
            key="add-task-modal"
            onClose={handleModalClose}
            onAdd={handleAddTask}
            onEdit={handleEditTaskSave}
            editingTask={editingTask}
            categories={categories}
          />
        )}
      </AnimatePresence>


      <AnimatePresence>
        {showPalette && (
          <CommandPalette
            key="command-palette"
            tasks={tasks}
            onClose={() => setShowPalette(false)}
            onSelectTask={handlePaletteSelect}
          />
        )}
      </AnimatePresence>

      <ToastContainer />
    </>
  );
};
