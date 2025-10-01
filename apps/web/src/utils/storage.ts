import { openDB } from 'idb';
import type { DBSchema, IDBPDatabase } from 'idb';
import type { Category, Zikr } from '@azkar/shared';

interface AzkarDB extends DBSchema {
  categories: {
    key: number;
    value: Category;
    indexes: { 'slug': string };
  };
  azkar: {
    key: number;
    value: Zikr & { categorySlug: string };
    indexes: { 'categorySlug': string };
  };
  progress: {
    key: number;
    value: {
      zikrId: number;
      currentCount: number;
      targetCount: number;
      lastUpdated: string;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<AzkarDB> | null = null;

  async init() {
    this.db = await openDB<AzkarDB>('azkar-db', 1, {
      upgrade(db) {
        // Categories store
        if (!db.objectStoreNames.contains('categories')) {
          const categoriesStore = db.createObjectStore('categories', { keyPath: 'id' });
          categoriesStore.createIndex('slug', 'slug', { unique: true });
        }

        // Azkar store
        if (!db.objectStoreNames.contains('azkar')) {
          const azkarStore = db.createObjectStore('azkar', { keyPath: 'id' });
          azkarStore.createIndex('categorySlug', 'categorySlug');
        }

        // Progress store
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'zikrId' });
        }
      },
    });
  }

  async saveCategories(categories: Category[]) {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('categories', 'readwrite');
    await Promise.all(categories.map(category => tx.store.put(category)));
    await tx.done;
  }

  async getCategories(): Promise<Category[]> {
    if (!this.db) await this.init();
    return await this.db!.getAll('categories');
  }

  async saveAzkar(azkar: Zikr[], categorySlug: string) {
    if (!this.db) await this.init();
    const tx = this.db!.transaction('azkar', 'readwrite');
    const azkarWithCategory = azkar.map(zikr => ({ ...zikr, categorySlug }));
    await Promise.all(azkarWithCategory.map(zikr => tx.store.put(zikr)));
    await tx.done;
  }

  async getAzkarByCategory(categorySlug: string): Promise<Zikr[]> {
    if (!this.db) await this.init();
    const azkar = await this.db!.getAllFromIndex('azkar', 'categorySlug', categorySlug);
    return azkar.map(({ categorySlug, ...zikr }) => zikr);
  }

  async saveProgress(zikrId: number, currentCount: number, targetCount: number) {
    if (!this.db) await this.init();
    await this.db!.put('progress', {
      zikrId,
      currentCount,
      targetCount,
      lastUpdated: new Date().toISOString(),
    });
  }

  async getProgress(zikrId: number) {
    if (!this.db) await this.init();
    return await this.db!.get('progress', zikrId);
  }

  async getAllProgress() {
    if (!this.db) await this.init();
    return await this.db!.getAll('progress');
  }

  async clearProgress() {
    if (!this.db) await this.init();
    await this.db!.clear('progress');
  }

  async clearAllData() {
    if (!this.db) await this.init();
    await this.db!.clear('categories');
    await this.db!.clear('azkar');
    await this.db!.clear('progress');
  }

  async isDataAvailable(): Promise<boolean> {
    if (!this.db) await this.init();
    const categories = await this.getCategories();
    return categories.length > 0;
  }
}

export const storage = new OfflineStorage();