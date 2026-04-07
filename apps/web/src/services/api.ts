import type { Category, Zikr, CategorySlug, TasbihOption } from '@azkar/shared';
import { storage } from '../utils/storage';

class ApiService {
  private async fetchLocalData(): Promise<any> {
    // Cache-busting URL to ensure we don't get old data
    const timestamp = new Date().getTime();
    const urls = [
      `azkar.json?v=${timestamp}`,
      `${import.meta.env.BASE_URL}azkar.json?v=${timestamp}`.replace(/\/+/g, '/').replace(':/', '://')
    ];
    
    for (const url of urls) {
      try {
        console.log('Trying to fetch azkar data from:', url);
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('Successfully loaded JSON from:', url);
          return data;
        }
      } catch (err) {
        console.warn(`Failed to fetch from ${url}:`, err);
      }
    }
    throw new Error('All fetch attempts failed');
  }

  async getCategories(): Promise<Category[]> {
    return [
      { id: 1, nameAr: "أذكار الصباح", slug: "morning", orderIndex: 1 },
      { id: 2, nameAr: "أذكار المساء", slug: "evening", orderIndex: 2 }
    ];
  }

  async getAzkarByCategory(categorySlug: CategorySlug): Promise<Zikr[]> {
    try {
      const data = await this.fetchLocalData();
      
      // Key in JSON is exactly "أذكار الصباح والمساء"
      const combinedKey = "أذكار الصباح والمساء";
      const categoryData = data[combinedKey];

      if (!categoryData || !categoryData.text) {
        console.error('Category data missing in JSON');
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

      // Crucial: save to storage using the category slug
      await storage.saveAzkar(processedAzkar, categorySlug);
      return processedAzkar;
    } catch (error) {
      console.error('Error loading azkar:', error);
      // Try to load from local storage if fetch fails
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