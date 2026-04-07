import type { Category, Zikr, CategorySlug, TasbihOption } from '@azkar/shared';
import { storage } from '../utils/storage';

class ApiService {
  private async fetchLocalData(): Promise<any> {
    const timestamp = new Date().getTime();
    // Absolute paths for GitHub Pages
    const urls = [
      `/Azkar/azkar.json?v=${timestamp}`,
      `azkar.json?v=${timestamp}`
    ];
    
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) return await response.json();
      } catch (err) {}
    }
    throw new Error('Load failed');
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
      const combinedKey = "أذكار الصباح والمساء";
      const categoryData = data[combinedKey];

      if (!categoryData || !categoryData.text) return [];

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
          .replace(/\(\s*.*?\s*مرات?\s*\)/g, '')
          .replace(/(ثلاث|أربع|خمس|ست|سبع|ثمان|تسع|عشر|مائة)\s*مرات?/g, '')
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

      // Always save fresh data to overwrite old "null" data
      await storage.saveAzkar(processedAzkar, categorySlug);
      return processedAzkar;
    } catch (error) {
      // If offline, use storage
      const cached = await storage.getAzkarByCategory(categorySlug);
      if (cached && cached.length > 0) return cached;
      return [];
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