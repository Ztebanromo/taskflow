import { Priority } from '../enums/Priority';
import { Recurrence } from '../enums/Recurrence';

export interface Task {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  priority: Priority;
  category: string; // nombre de la categoría (puede ser default o personalizado)
  recurrence: Recurrence;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  autoRenew: boolean;
}
