import { CategoryItem } from '../../shared/types/global.types';

export interface ICategoryRepository {
  getAll(): CategoryItem[];
  save(category: CategoryItem): void;
  saveAll(categories: CategoryItem[]): void;
  delete(id: string): void;
}
