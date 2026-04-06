import { Priority } from '../../domain/enums/Priority';
import { Recurrence } from '../../domain/enums/Recurrence';

export type FilterView = 'all' | 'high' | 'today' | 'automated';

export interface TaskStats {
  total: number;
  completed: number;
  completedToday: number;
  totalToday: number;
  percentage: number;
}

export interface CategoryItem {
  id: string;
  name: string;
  color: string; // CSS hex color
  isDefault: boolean;
}

export type PriorityOption = {
  value: Priority;
  label: string;
};

export type RecurrenceOption = {
  value: Recurrence;
  label: string;
};

