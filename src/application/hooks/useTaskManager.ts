import { useReducer } from 'react';
import { Task } from '../../domain/entities/Task';
import { LocalStorageTaskRepository } from '../../infrastructure/repositories/LocalStorageTaskRepository';
import { LocalStorageCategoryRepository } from '../../infrastructure/repositories/LocalStorageCategoryRepository';

import { CreateTask } from '../use-cases/CreateTask';
import { CompleteTask } from '../use-cases/CompleteTask';
import { UndoComplete } from '../use-cases/UndoComplete';
import { DeleteTask } from '../use-cases/DeleteTask';
import { EditTask } from '../use-cases/EditTask';
import { AutoRecreateTask } from '../use-cases/AutoRecreateTask';

import { CreateTaskDTO } from '../dtos/CreateTaskDTO';
import { EditTaskDTO } from '../dtos/EditTaskDTO';
import { CategoryItem } from '../../shared/types/global.types';

// ────────────────────────────────────────────────────────────────────────────
// State & Actions
// ────────────────────────────────────────────────────────────────────────────

interface TaskState {
  tasks: Task[];
  categories: CategoryItem[];
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'SET_CATEGORIES'; payload: CategoryItem[] };

// ────────────────────────────────────────────────────────────────────────────
// Initial Default Categories
// ────────────────────────────────────────────────────────────────────────────

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: '1', name: 'Quant24', color: '#7c6af7', isDefault: true },
  { id: '2', name: 'Antigravity', color: '#f76a8a', isDefault: true },
  { id: '3', name: 'Personal', color: '#4ade80', isDefault: true },
  { id: '4', name: 'Otro', color: '#8686a3', isDefault: true },
];

// ────────────────────────────────────────────────────────────────────────────
// Repository & use-case singletons
// ────────────────────────────────────────────────────────────────────────────

const repository = new LocalStorageTaskRepository();
const categoryRepository = new LocalStorageCategoryRepository();

const createTaskUC = new CreateTask(repository);
const completeTaskUC = new CompleteTask(repository);
const undoCompleteUC = new UndoComplete(repository);
const deleteTaskUC = new DeleteTask(repository);
const editTaskUC = new EditTask(repository);
const autoRecreateUC = new AutoRecreateTask(repository);

// ────────────────────────────────────────────────────────────────────────────
// Reducer (100% PURE)
// ────────────────────────────────────────────────────────────────────────────

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    default:
      return state;
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Hook
// ────────────────────────────────────────────────────────────────────────────

export function useTaskManager() {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [], categories: [] }, () => {
    const tasks = repository.getAll();
    const categories = categoryRepository.getAll();
    return {
      tasks,
      categories: categories.length > 0 ? categories : DEFAULT_CATEGORIES
    };
  });

  // ── Operations (State Manipulation & Side Effects) ─────────────────────────

  const addTask = (dto: CreateTaskDTO) => {
    const task = createTaskUC.execute(dto);
    dispatch({ type: 'SET_TASKS', payload: [...state.tasks, task] });
  };

  const completeTask = (id: string) => {
    const original = state.tasks.find((t) => t.id === id);
    let updated = completeTaskUC.execute(state.tasks, id);

    if (original?.autoRenew) {
      updated = autoRecreateUC.execute(updated, id);
    }
    
    dispatch({ type: 'SET_TASKS', payload: updated });
  };

  const undoComplete = (id: string) => {
    const updated = undoCompleteUC.execute(state.tasks, id);
    dispatch({ type: 'SET_TASKS', payload: updated });
  };

  const deleteTask = (id: string) => {
    const updated = deleteTaskUC.execute(state.tasks, id);
    dispatch({ type: 'SET_TASKS', payload: updated });
  };

  const editTask = (dto: EditTaskDTO) => {
    const updated = editTaskUC.execute(state.tasks, dto);
    dispatch({ type: 'SET_TASKS', payload: updated });
  };

  const clearCompleted = () => {
    const filtered = state.tasks.filter((t) => !t.completed);
    repository.saveAll(filtered);
    dispatch({ type: 'SET_TASKS', payload: filtered });
  };

  const importTasks = (tasks: Task[]) => {
    repository.saveAll(tasks);
    dispatch({ type: 'SET_TASKS', payload: tasks });
  };

  const addCategory = (category: CategoryItem) => {
    const updated = [...state.categories, category];
    categoryRepository.saveAll(updated);
    dispatch({ type: 'SET_CATEGORIES', payload: updated });
  };

  const deleteCategory = (id: string) => {
    const updated = state.categories.filter(c => c.id !== id);
    categoryRepository.saveAll(updated);
    dispatch({ type: 'SET_CATEGORIES', payload: updated });
  };

  const exportTasks = () => {
    const json = JSON.stringify(state.tasks, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'taskflow-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    tasks: state.tasks,
    categories: state.categories,
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
  };
}
