import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class CompleteTask {
  constructor(private readonly repository: ITaskRepository) {}

  execute(tasks: Task[], id: string): Task[] {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, completed: true, completedAt: new Date() };
      }
      return t;
    });
    this.repository.saveAll(updated);
    return updated;
  }
}
