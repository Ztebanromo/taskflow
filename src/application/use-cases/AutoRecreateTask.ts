import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { Recurrence } from '../../domain/enums/Recurrence';
import { calcularSiguienteFecha } from '../../infrastructure/services/RecurrenceService';
import { generateUUID } from '../../shared/utils/uuid';

export class AutoRecreateTask {
  constructor(private readonly repository: ITaskRepository) {}

  execute(tasks: Task[], originalId: string): Task[] {
    const original = tasks.find((t) => t.id === originalId);
    if (!original || original.recurrence === Recurrence.NONE) {
      return tasks;
    }

    const newDueDate = calcularSiguienteFecha(new Date(), original.recurrence);

    const newTask: Task = {
      id: generateUUID(),
      title: original.title,
      subtitle: original.subtitle,
      icon: original.icon,
      priority: original.priority,
      category: original.category,
      recurrence: original.recurrence,
      dueDate: newDueDate,
      completed: false,
      createdAt: new Date(),
      autoRenew: original.autoRenew,
    };

    const updated = [...tasks, newTask];
    this.repository.saveAll(updated);
    return updated;
  }
}
