import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';

export class UndoComplete {
  constructor(private readonly repository: ITaskRepository) {}

  execute(tasks: Task[], id: string): Task[] {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return { ...t, completed: false, completedAt: undefined };
      }
      return t;
    });
    this.repository.saveAll(updated);
    return updated;
  }
}
