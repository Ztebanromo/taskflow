import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { STORAGE_KEY } from '../../shared/constants/app.constants';
import { TaskMapper } from '../mappers/TaskMapper';

export class LocalStorageTaskRepository implements ITaskRepository {
  getAll(): Task[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as unknown[];
      return parsed.map((item) =>
        TaskMapper.toEntity(item as Parameters<typeof TaskMapper.toEntity>[0])
      );
    } catch {
      return [];
    }
  }

  save(task: Task): void {
    const all = this.getAll();
    const idx = all.findIndex((t) => t.id === task.id);
    if (idx >= 0) {
      all[idx] = task;
    } else {
      all.push(task);
    }
    this.persist(all);
  }

  saveAll(tasks: Task[]): void {
    this.persist(tasks);
  }

  delete(id: string): void {
    const all = this.getAll().filter((t) => t.id !== id);
    this.persist(all);
  }

  private persist(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks.map(TaskMapper.toRaw)));
  }
}
