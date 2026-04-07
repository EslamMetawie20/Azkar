import type { Category, Zikr, CategorySlug, TasbihOption } from '@azkar/shared';
import { storage } from '../utils/storage';

class ApiService {
  private async fetchLocalData(): Promise<any> {
    // Robust URL construction
    const baseUrl = import.meta.env.BASE_URL.endsWith('/') 
      ? import.meta.env.BASE_URL 
      : `${import.meta.env.BASE_URL}/`;
    const url = `${baseUrl}azkar.json`.replace(/\/+/g, '/').replace(':/', '://');
    
    console.log('Fetching azkar data from:', url);
    
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to load: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      // Fallback for different environments
      if (url.includes('/Azkar/')) {
        console.log('Trying fallback to root azkar.json');
        const fallbackRes = await fetch('azkar.json');
        return await fallbackRes.json();
      }
      throw err;
    }
  }

  async getCategories(): Promise<Category[]> {
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
      
      // The keys in your JSON are exactly these:
      const morningKey = "أذكار الصباح والمساء"; 
      const eveningKey = "أذكار الصباح والمساء";
      
      const categoryData = categorySlug === 'morning' ? data[morningKey] : data[eveningKey];

      if (!categoryData || !categoryData.text) {
        console.error(`Key not found in JSON for ${categorySlug}`);
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

  async isOnline(): Promise<boolean> { return true; }

  async ensureDataAvailable(): Promise<boolean> {
    const isDataCached = await storage.isDataAvailable();
    if (!isDataCached) {
      try {
        await this.getCategories();
        await this.getAzkarByCategory('morning');
        await this.getAzkarByCategory('evening');
        return true;
      } catch (error) {
        return false;
      }
    }
    return true;
  }
}

export const apiService = new ApiService();