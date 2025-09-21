import { createApi, Category, Zikr, CategorySlug } from '@azkar/shared';
import { mobileStorage } from '../utils/storage';

class MobileApiService {
  private api = createApi('http://localhost:8080');

  async getCategories(): Promise<Category[]> {
    try {
      const categories = await this.api.getCategories();
      await mobileStorage.saveCategories(categories);
      return categories;
    } catch (error) {
      console.warn('Failed to fetch categories from API, falling back to cache:', error);
      return await mobileStorage.getCategories();
    }
  }

  async getAzkarByCategory(categorySlug: CategorySlug): Promise<Zikr[]> {
    try {
      const azkar = await this.api.getAzkarByCategory(categorySlug);
      await mobileStorage.saveAzkar(azkar, categorySlug);
      return azkar;
    } catch (error) {
      console.warn(`Failed to fetch azkar for ${categorySlug} from API, falling back to cache:`, error);
      return await mobileStorage.getAzkarByCategory(categorySlug);
    }
  }

  async isOnline(): Promise<boolean> {
    try {
      await this.api.getHealth();
      return true;
    } catch {
      return false;
    }
  }

  async syncData(): Promise<boolean> {
    try {
      await this.getCategories();
      await this.getAzkarByCategory('morning');
      await this.getAzkarByCategory('evening');
      return true;
    } catch (error) {
      console.error('Failed to sync data:', error);
      return false;
    }
  }

  async ensureDataAvailable(): Promise<boolean> {
    const isDataCached = await mobileStorage.isDataAvailable();

    if (!isDataCached) {
      return await this.syncData();
    }

    return true;
  }
}

export const mobileApiService = new MobileApiService();