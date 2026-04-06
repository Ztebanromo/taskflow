import { CategoryItem } from '../../shared/types/global.types';
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository';
import { CATEGORIES_KEY } from '../../shared/constants/app.constants';

export class LocalStorageCategoryRepository implements ICategoryRepository {
  getAll(): CategoryItem[] {
    try {
      const raw = localStorage.getItem(CATEGORIES_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as CategoryItem[];
    } catch {
      return [];
    }
  }

  save(category: CategoryItem): void {
    const all = this.getAll();
    const idx = all.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      all[idx] = category;
    } else {
      all.push(category);
    }
    this.persist(all);
  }

  saveAll(categories: CategoryItem[]): void {
    this.persist(categories);
  }

  delete(id: string): void {
    const all = this.getAll().filter((c) => c.id !== id);
    this.persist(all);
  }

  private persist(categories: CategoryItem[]): void {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }
}
