import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../../domain/entities/Task';
import { Priority } from '../../../domain/enums/Priority';
import { Recurrence } from '../../../domain/enums/Recurrence';
import { CreateTaskDTO } from '../../../application/dtos/CreateTaskDTO';
import { EditTaskDTO } from '../../../application/dtos/EditTaskDTO';
import { ModalOverlay } from './ModalOverlay';
import { cn } from '../../../shared/utils/cn';

import { CategoryItem } from '../../../shared/types/global.types';

// ── Emoji picker list ──────────────────────────────────────────────────────
const EMOJIS = [
  '📋','✅','🚀','💡','🔥','📊','💼','🎯','⚡','🛠',
  '📝','🌟','🧠','💻','📈','🔔','🎨','📅','🏆','🔍',
];

interface AddTaskModalProps {
  onClose: () => void;
  onAdd: (dto: CreateTaskDTO) => void;
  onEdit: (dto: EditTaskDTO) => void;
  editingTask?: Task | null;
  categories: CategoryItem[];
}

type FormState = {
  title: string;
  subtitle: string;
  icon: string;
  priority: Priority;
  category: string;
  recurrence: Recurrence;
  dueDate: string;
  autoRenew: boolean;
};

// ── Render helpers ──────────────────────────────────────────────────────
const ToggleSet = <T extends string>({
  options,
  value,
  onChange,
  id,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  id: string;
}) => (
  <div className="flex gap-2 flex-wrap">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        id={`${id}-${opt.value}`}
        onClick={() => onChange(opt.value)}
        className={cn(
          'px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border shadow-sm',
          value === opt.value
            ? 'bg-[var(--accent)] border-[var(--accent)] text-white shadow-[var(--accent)]/20'
            : 'bg-white/5 border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]'
        )}
      >
        {opt.label}
      </button>
    ))}
  </div>
);

export const AddTaskModal: React.FC<AddTaskModalProps> = ({
  onClose,
  onAdd,
  onEdit,
  editingTask,
  categories,
}) => {
  const titleRef = useRef<HTMLInputElement>(null);
  const isEditing = !!editingTask;

  const [form, setForm] = useState<FormState>(() => {
    if (editingTask) {
      return {
        title: editingTask.title,
        subtitle: editingTask.subtitle ?? '',
        icon: editingTask.icon,
        priority: editingTask.priority,
        category: editingTask.category,
        recurrence: editingTask.recurrence,
        dueDate: editingTask.dueDate
          ? editingTask.dueDate.toISOString().split('T')[0]
          : '',
        autoRenew: editingTask.autoRenew,
      };
    }
    return {
      title: '',
      subtitle: '',
      icon: '📋',
      priority: Priority.MEDIUM,
      category: categories[0]?.name || 'Personal',
      recurrence: Recurrence.NONE,
      dueDate: '',
      autoRenew: false,
    };
  });

  const [error, setError] = useState('');

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!form.title.trim()) {
      setError('El título es obligatorio');
      titleRef.current?.focus();
      return;
    }
    setError('');

    const dueDate = form.dueDate ? new Date(form.dueDate) : undefined;

    if (isEditing && editingTask) {
      const dto: EditTaskDTO = {
        id: editingTask.id,
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || undefined,
        icon: form.icon,
        priority: form.priority,
        category: form.category,
        recurrence: form.recurrence,
        dueDate,
        autoRenew: form.autoRenew,
      };
      onEdit(dto);
    } else {
      const dto: CreateTaskDTO = {
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || undefined,
        icon: form.icon,
        priority: form.priority,
        category: form.category,
        recurrence: form.recurrence,
        dueDate,
        autoRenew: form.autoRenew,
      };
      onAdd(dto);
    }
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
  };



  return (
    <ModalOverlay onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="card w-full max-w-xl max-h-[92dvh] overflow-y-auto shadow-2xl glass-glow"
        onKeyDown={handleKeyDown}
        id="add-task-modal"
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="w-2 h-7 rounded-full bg-gradient-to-b from-[var(--accent)] to-[var(--accent2)]" />
            <h3 className="font-brand text-2xl font-bold text-[var(--text)] tracking-tight">
              {isEditing ? 'Editar Tarea' : 'Nueva Tarea'}
            </h3>
          </div>
          <button
            onClick={onClose}
            id="modal-close-btn"
            aria-label="Cerrar modal"
            className="p-2 rounded-xl hover:bg-white/5 text-[var(--muted)] hover:text-[var(--text)] transition-all active:scale-90"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-8">
          {/* Main Info Section */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="task-title" className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] ml-1">
                Título de la tarea
              </label>
              <input
                ref={titleRef}
                id="task-title"
                type="text"
                placeholder="Ej: Finalizar reporte mensual"
                className="text-lg font-medium py-3.5 px-5 bg-white/[0.03] border-[var(--border)] focus:bg-white/[0.01]"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                maxLength={80}
              />
              {error && <p className="text-xs text-[var(--red)] font-medium mt-1 ml-1">{error}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="task-subtitle" className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] ml-1">
                Descripción (opcional)
              </label>
              <textarea
                id="task-subtitle"
                placeholder="Agrega una nota o instrucciones adicionales..."
                className="min-h-[80px] resize-none py-3.5 px-5 bg-white/[0.03] border-[var(--border)] focus:bg-white/[0.01] leading-relaxed"
                value={form.subtitle}
                onChange={(e) => set('subtitle', e.target.value)}
                maxLength={200}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            {/* Left Column */}
            <div className="flex flex-col gap-8">
              {/* Emoji selector */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] ml-1">
                  Ícono Visual
                </span>
                <div className="grid grid-cols-5 gap-2 p-2 rounded-2xl bg-white/[0.02] border border-[var(--border)]">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      id={`emoji-${emoji}`}
                      onClick={() => set('icon', emoji)}
                      className={cn(
                        'w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all duration-200',
                        form.icon === emoji
                          ? 'bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30 scale-110'
                          : 'hover:bg-white/10 opacity-60 hover:opacity-100'
                      )}
                      aria-label={`Seleccionar emoji ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] ml-1">
                  Prioridad
                </span>
                <ToggleSet
                  id="priority"
                  value={form.priority}
                  onChange={(v) => set('priority', v)}
                  options={[
                    { value: Priority.HIGH,   label: 'Crítica' },
                    { value: Priority.MEDIUM, label: 'Media' },
                    { value: Priority.LOW,    label: 'Baja' },
                  ]}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8">
              {/* Category selector */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] ml-1">
                  Categoría
                </span>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => set('category', cat.name)}
                      className={cn(
                        'flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border',
                        form.category === cat.name
                          ? 'bg-white/10 border-white/20 text-white'
                          : 'bg-transparent border-[var(--border)] text-[var(--muted)] opacity-60 hover:opacity-100 hover:border-white/10'
                      )}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recurrence */}
              <div className="flex flex-col gap-3">
                <span className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] ml-1">
                  Recurrencia
                </span>
                <ToggleSet
                  id="recurrence"
                  value={form.recurrence}
                  onChange={(v) => set('recurrence', v)}
                  options={[
                    { value: Recurrence.NONE,    label: 'Una vez' },
                    { value: Recurrence.DAILY,   label: 'Diario' },
                    { value: Recurrence.WEEKLY,  label: 'Semanal' },
                    { value: Recurrence.MONTHLY, label: 'Mensual' },
                  ]}
                />
              </div>

              {/* Due date */}
              <div className="flex flex-col gap-3">
                <label htmlFor="task-due-date" className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-[0.2em] ml-1">
                  Fecha Vencimiento
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  className="py-2.5 px-4 bg-white/[0.03] border-[var(--border)] focus:border-[var(--accent)] font-medium"
                  value={form.dueDate}
                  onChange={(e) => set('dueDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Auto renew toggle */}
          <div className="mt-4 flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/[0.05] shadow-inner">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
                form.autoRenew ? "bg-[var(--green)]/20 text-[var(--green)]" : "bg-white/5 text-[var(--muted)]"
              )}>
                ⚡
              </div>
              <div>
                <p className="text-[15px] font-semibold text-[var(--text)]">Auto-renovar Tarea</p>
                <p className="text-xs text-[var(--muted)] mt-0.5 leading-relaxed">
                  Se recreará automáticamente al finalizar
                </p>
              </div>
            </div>
            <button
              type="button"
              id="auto-renew-toggle"
              role="switch"
              aria-checked={form.autoRenew}
              onClick={() => set('autoRenew', !form.autoRenew)}
              className={cn(
                'relative w-12 h-6.5 rounded-full transition-all duration-300 shrink-0 p-1',
                form.autoRenew
                  ? 'bg-[var(--green)]'
                  : 'bg-white/10'
              )}
            >
              <div
                className={cn(
                  'w-4.5 h-4.5 rounded-full bg-white transition-transform duration-300 shadow-sm',
                  form.autoRenew ? 'translate-x-5.5' : 'translate-x-0'
                )}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)] hover:bg-white/5 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-xl text-sm font-bold bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/30 hover:scale-[1.03] active:scale-[0.97] transition-all"
            >
              {isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </motion.div>
    </ModalOverlay>
  );
};
