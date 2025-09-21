import { createApi } from '@azkar/shared';
import type { Category, Zikr, CategorySlug } from '@azkar/shared';
import { storage } from '../utils/storage';

class ApiService {
  private api = createApi('http://localhost:8080');

  async getCategories(): Promise<Category[]> {
    try {
      const categories = await this.api.getCategories();
      await storage.saveCategories(categories);
      return categories;
    } catch (error) {
      console.warn('Failed to fetch categories from API, falling back to cache:', error);
      return await storage.getCategories();
    }
  }

  async getAzkarByCategory(categorySlug: CategorySlug): Promise<Zikr[]> {
    try {
      const azkar = await this.api.getAzkarByCategory(categorySlug);
      await storage.saveAzkar(azkar, categorySlug);
      return azkar;
    } catch (error) {
      console.warn(`Failed to fetch azkar for ${categorySlug} from API, falling back to cache:`, error);
      return await storage.getAzkarByCategory(categorySlug);
    }
  }

  async isOnline(): Promise<boolean> {
    if (!navigator.onLine) return false;

    try {
      await this.api.getHealth();
      return true;
    } catch {
      return false;
    }
  }

  async ensureDataAvailable(): Promise<boolean> {
    const isDataCached = await storage.isDataAvailable();

    if (!isDataCached) {
      try {
        await this.getCategories();
        await this.getAzkarByCategory('morning');
        await this.getAzkarByCategory('evening');
        return true;
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        return false;
      }
    }

    return true;
  }
}

export const apiService = new ApiService();