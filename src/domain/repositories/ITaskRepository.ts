import { Task } from '../entities/Task';

export interface ITaskRepository {
  getAll(): Task[];
  save(task: Task): void;
  saveAll(tasks: Task[]): void;
  delete(id: string): void;
}
