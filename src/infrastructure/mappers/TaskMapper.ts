import { Task } from '../../domain/entities/Task';
import { Priority } from '../../domain/enums/Priority';
import { Recurrence } from '../../domain/enums/Recurrence';

interface RawTask {
  id: string;
  title: string;
  subtitle?: string;
  icon: string;
  priority: string;
  category: string;
  recurrence: string;
  dueDate?: string;
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  autoRenew: boolean;
}

export class TaskMapper {
  static toEntity(raw: RawTask): Task {
    return {
      id: raw.id,
      title: raw.title,
      subtitle: raw.subtitle,
      icon: raw.icon,
      priority: raw.priority as Priority,
      category: raw.category,
      recurrence: raw.recurrence as Recurrence,
      dueDate: raw.dueDate ? new Date(raw.dueDate) : undefined,
      completed: raw.completed,
      completedAt: raw.completedAt ? new Date(raw.completedAt) : undefined,
      createdAt: new Date(raw.createdAt),
      autoRenew: raw.autoRenew,
    };
  }

  static toRaw(task: Task): RawTask {
    return {
      id: task.id,
      title: task.title,
      subtitle: task.subtitle,
      icon: task.icon,
      priority: task.priority,
      category: task.category,
      recurrence: task.recurrence,
      dueDate: task.dueDate?.toISOString(),
      completed: task.completed,
      completedAt: task.completedAt?.toISOString(),
      createdAt: task.createdAt.toISOString(),
      autoRenew: task.autoRenew,
    };
  }
}
