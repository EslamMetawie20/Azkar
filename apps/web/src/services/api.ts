import type { Category, Zikr, CategorySlug, TasbihOption } from '@azkar/shared';
import { storage } from '../utils/storage';

class ApiService {
  private async fetchLocalData(): Promise<any> {
    const response = await fetch(`${import.meta.env.BASE_URL}azkar.json`);
    if (!response.ok) {
      throw new Error('Failed to load local azkar.json');
    }
    return await response.json();
  }

  async getCategories(): Promise<Category[]> {
    // These are static for our app
    const categories: Category[] = [
      { id: 1, nameAr: "أذكار الصباح", slug: "morning", orderIndex: 1 },
      { id: 2, nameAr: "أذكار المساء", slug: "evening", orderIndex: 2 }
    ];
    await storage.saveCategories(categories);
    return categories;
  }

  async getAzkarByCategory(categorySlug: CategorySlug): Promise<Zikr[]> {
    try {
      const data = await this.fetchLocalData();

      // Try specific keys first, then fallback to combined key
      const morningKeys = ["أذكار الصباح", "اذكار الصباح"];
      const eveningKeys = ["أذكار المساء", "اذكار المساء"];
      const combinedKeys = ["أذكار الصباح والمساء", "اذكار الصباح والمساء"];

      let categoryData = null;

      if (categorySlug === 'morning') {
        const key = morningKeys.find(k => data[k]) || combinedKeys.find(k => data[k]);
        if (key) categoryData = data[key];
      } else {
        const key = eveningKeys.find(k => data[k]) || combinedKeys.find(k => data[k]);
        if (key) categoryData = data[key];
      }

      if (!categoryData || !categoryData.text) {
        console.warn(`No data found for category: ${categorySlug}`);
        return [];
      }

      const azkarTexts: string[] = categoryData.text.filter((text: string) => text && text.trim().length > 0);
      const footnotes: string[] = categoryData.footnote || [];

      const processedAzkar: Zikr[] = azkarTexts.map((text, index) => {
        let repeatMin = 1;
        if (text.includes('ثلاث مرات') || text.includes('ثلاث')) repeatMin = 3;
        else if (text.includes('سبع مرات') || text.includes('سبع')) repeatMin = 7;
        else if (text.includes('مائة مرة') || text.includes('مائة')) repeatMin = 100;
        else if (text.includes('عشر مرات') || text.includes('عشر')) repeatMin = 10;
        else if (text.includes('أربع مرات') || text.includes('أربع')) repeatMin = 4;

        const cleanText = text
          .replace(/\(\s*.*?\s*مرا?ت?\s*\)/g, '')
          .replace(/(ثلاث|أربع|خمس|ست|سبع|ثمان|تسع|عشر|مائة)\s*مرا?ت?/g, '')
          .replace(/\s+/g, ' ')
          .trim();

        return {
          id: index + 1,
          textAr: cleanText,
          footnoteAr: footnotes[index] || undefined,
          repeatMin: repeatMin,
          orderIndex: index + 1
        };
      });

      await storage.saveAzkar(processedAzkar, categorySlug);
      return processedAzkar;
    } catch (error) {
      console.error(`Failed to load azkar for ${categorySlug}:`, error);
      return await storage.getAzkarByCategory(categorySlug);
    }
  }

  async getTasbihOptions(): Promise<TasbihOption[]> {
    // Static tasbih options
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

  async isOnline(): Promise<boolean> {
    return true; // Always true for static local data
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