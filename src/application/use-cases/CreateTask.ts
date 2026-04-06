import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { CreateTaskDTO } from '../dtos/CreateTaskDTO';
import { generateUUID } from '../../shared/utils/uuid';

export class CreateTask {
  constructor(private readonly repository: ITaskRepository) {}

  execute(dto: CreateTaskDTO): Task {
    const task: Task = {
      id: generateUUID(),
      title: dto.title,
      subtitle: dto.subtitle,
      icon: dto.icon,
      priority: dto.priority,
      category: dto.category,
      recurrence: dto.recurrence,
      dueDate: dto.dueDate,
      completed: false,
      createdAt: new Date(),
      autoRenew: dto.autoRenew,
    };
    this.repository.save(task);
    return task;
  }
}
