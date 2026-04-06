import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { EditTaskDTO } from '../dtos/EditTaskDTO';

export class EditTask {
  constructor(private readonly repository: ITaskRepository) {}

  execute(tasks: Task[], dto: EditTaskDTO): Task[] {
    const updated = tasks.map((t) => {
      if (t.id === dto.id) {
        return {
          ...t,
          ...(dto.title !== undefined && { title: dto.title }),
          ...(dto.subtitle !== undefined && { subtitle: dto.subtitle }),
          ...(dto.icon !== undefined && { icon: dto.icon }),
          ...(dto.priority !== undefined && { priority: dto.priority }),
          ...(dto.category !== undefined && { category: dto.category }),
          ...(dto.recurrence !== undefined && { recurrence: dto.recurrence }),
          ...(dto.dueDate !== undefined && { dueDate: dto.dueDate }),
          ...(dto.autoRenew !== undefined && { autoRenew: dto.autoRenew }),
        };
      }
      return t;
    });
    this.repository.saveAll(updated);
    return updated;
  }
}
