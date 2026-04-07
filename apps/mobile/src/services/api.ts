import { Category, Zikr, CategorySlug } from '@azkar/shared';
import { mobileStorage } from '../utils/storage';
import { mockDataService } from './mockData';

class MobileApiService {
  // Since we removed the backend, mobile will use mock data or local storage
  // In a real production app, we would bundle azkar.json with the mobile app
  
  async getCategories(): Promise<Category[]> {
    const categories: Category[] = [
      { id: 1, nameAr: "أذكار الصباح", slug: "morning", orderIndex: 1 },
      { id: 2, nameAr: "أذكار المساء", slug: "evening", orderIndex: 2 }
    ];
    return categories;
  }

  async getAzkarByCategory(categorySlug: CategorySlug): Promise<Zikr[]> {
    // For mobile, we use the existing mockDataService which already processes the data
    return mockDataService.getAzkarByCategory(categorySlug);
  }

  async getHealth(): Promise<{ status: string }> {
    return { status: 'ok' };
  }
}

export const mobileApiService = new MobileApiService();