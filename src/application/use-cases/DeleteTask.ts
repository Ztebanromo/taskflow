import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class DeleteTask {
  constructor(private readonly repository: ITaskRepository) {}

  execute(tasks: Task[], id: string): Task[] {
    const updated = tasks.filter((t) => t.id !== id);
    this.repository.saveAll(updated);
    return updated;
  }
}
