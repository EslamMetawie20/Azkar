import { createApi, Category, Zikr, CategorySlug } from '@azkar/shared';
import { mobileStorage } from '../utils/storage';
import { mockDataService } from './mockData';

class MobileApiService {
  private api = createApi('http://localhost:8080');

  async getCategories(): Promise<Category[]> {
    try {
      const categories = await this.api.getCategories();
      await mobileStorage.saveCategories(categories);
      return categories;
    } catch (error) {
      console.warn('Failed to fetch categories from API, falling back to cache:', error);
      const cached = await mobileStorage.getCategories();
      if (cached.length > 0) {
        return cached;
      }

      // If no cached data, use mock data
      console.warn('No cached categories found, using mock data');
      const mockCategories = await mockDataService.getCategories();
      await mobileStorage.saveCategories(mockCategories);
      return mockCategories;
    }
  }

  async getAzkarByCategory(categorySlug: CategorySlug): Promise<Zikr[]> {
    console.log(`API: Requesting azkar for category: ${categorySlug}`);
    try {
      const azkar = await this.api.getAzkarByCategory(categorySlug);
      console.log(`API: Successfully fetched ${azkar.length} azkar from server for ${categorySlug}`);
      await mobileStorage.saveAzkar(azkar, categorySlug);
      return azkar;
    } catch (error) {
      console.warn(`Failed to fetch azkar for ${categorySlug} from API, falling back to cache:`, error);
      const cached = await mobileStorage.getAzkarByCategory(categorySlug);
      console.log(`API: Found ${cached.length} cached azkar for ${categorySlug}`);
      if (cached.length > 0) {
        return cached;
      }

      // If no cached data, use mock data
      console.warn(`No cached azkar found for ${categorySlug}, using mock data`);
      const mockAzkar = await mockDataService.getAzkarByCategory(categorySlug);
      console.log(`API: Mock service returned ${mockAzkar.length} azkar for ${categorySlug}`);
      await mobileStorage.saveAzkar(mockAzkar, categorySlug);
      return mockAzkar;
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
      try {
        return await this.syncData();
      } catch (error) {
        console.warn('Failed to sync data from API, using mock data as fallback');
        // Initialize with mock data if API is unavailable
        await this.getCategories();
        await this.getAzkarByCategory('morning');
        await this.getAzkarByCategory('evening');
        return true;
      }
    }

    return true;
  }
}

export const mobileApiService = new MobileApiService();