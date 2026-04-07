import { createApi } from '@azkar/shared';
import type { Category, Zikr, CategorySlug, TasbihOption } from '@azkar/shared';
import { storage } from '../utils/storage';

class ApiService {
  private api = createApi(import.meta.env.VITE_API_URL || 'http://localhost:8080');

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

  async getTasbihOptions(): Promise<TasbihOption[]> {
    try {
      return await this.api.getTasbihOptions();
    } catch (error) {
      console.warn('Failed to fetch tasbih options from API, using mock data:', error);
      return [
        {
          id: 'standard',
          nameAr: 'تسبيح عام',
          items: [
            { id: '1', textAr: 'سبحان الله', count: 33 },
            { id: '2', textAr: 'الحمد لله', count: 33 },
            { id: '3', textAr: 'الله أكبر', count: 34 }
          ]
        }
      ];
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