import type { Category, Zikr, CategorySlug, TasbihOption } from '@azkar/shared';
import { storage } from '../utils/storage';
import { azkarSabahMasaaData } from '../data/azkarData';

class ApiService {
  async getCategories(): Promise<Category[]> {
    return [
      { id: 1, nameAr: "أذكار الصباح", slug: "morning", orderIndex: 1 },
      { id: 2, nameAr: "أذكار المساء", slug: "evening", orderIndex: 2 }
    ];
  }

  async getAzkarByCategory(categorySlug: CategorySlug): Promise<Zikr[]> {
    try {
      // Return hardcoded data directly - no network request, impossible to fail
      if (categorySlug === 'morning' || categorySlug === 'evening') {
        const azkarData = [...azkarSabahMasaaData];
        await storage.saveAzkar(azkarData, categorySlug);
        return azkarData;
      }
      return [];
    } catch (error) {
      console.error('Error loading azkar:', error);
      return await storage.getAzkarByCategory(categorySlug);
    }
  }

  async getTasbihOptions(): Promise<TasbihOption[]> {
    return [{
      id: 'standard',
      nameAr: 'تسبيح عام',
      items: [
        { id: '1', textAr: 'سبحان الله', count: 33 },
        { id: '2', textAr: 'الحمد لله', count: 33 },
        { id: '3', textAr: 'الله أكبر', count: 34 }
      ]
    }];
  }

  async isOnline(): Promise<boolean> { return true; }

  async ensureDataAvailable(): Promise<boolean> {
    try {
      await this.getAzkarByCategory('morning');
      await this.getAzkarByCategory('evening');
      return true;
    } catch (error) {
      return false;
    }
  }
}

export const apiService = new ApiService();