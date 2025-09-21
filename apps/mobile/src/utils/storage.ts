import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category, Zikr } from '@azkar/shared';

const KEYS = {
  CATEGORIES: 'azkar_categories',
  AZKAR_MORNING: 'azkar_morning',
  AZKAR_EVENING: 'azkar_evening',
  PROGRESS: 'azkar_progress',
  SETTINGS: 'azkar_settings'
};

interface ZikrProgress {
  zikrId: number;
  currentCount: number;
  targetCount: number;
  lastUpdated: string;
}

interface AppSettings {
  fontSize: number;
  readingMode: boolean;
  notificationsEnabled: boolean;
}

class MobileStorage {
  async saveCategories(categories: Category[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  }

  async getCategories(): Promise<Category[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading categories:', error);
      return [];
    }
  }

  async saveAzkar(azkar: Zikr[], categorySlug: string): Promise<void> {
    const key = categorySlug === 'morning' ? KEYS.AZKAR_MORNING : KEYS.AZKAR_EVENING;
    await AsyncStorage.setItem(key, JSON.stringify(azkar));
  }

  async getAzkarByCategory(categorySlug: string): Promise<Zikr[]> {
    try {
      const key = categorySlug === 'morning' ? KEYS.AZKAR_MORNING : KEYS.AZKAR_EVENING;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error loading azkar for ${categorySlug}:`, error);
      return [];
    }
  }

  async saveProgress(zikrId: number, currentCount: number, targetCount: number): Promise<void> {
    try {
      const existingProgress = await this.getAllProgress();
      const updatedProgress = existingProgress.filter(p => p.zikrId !== zikrId);

      updatedProgress.push({
        zikrId,
        currentCount,
        targetCount,
        lastUpdated: new Date().toISOString()
      });

      await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  }

  async getProgress(zikrId: number): Promise<ZikrProgress | null> {
    try {
      const allProgress = await this.getAllProgress();
      return allProgress.find(p => p.zikrId === zikrId) || null;
    } catch (error) {
      console.error('Error loading progress:', error);
      return null;
    }
  }

  async getAllProgress(): Promise<ZikrProgress[]> {
    try {
      const data = await AsyncStorage.getItem(KEYS.PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading all progress:', error);
      return [];
    }
  }

  async clearProgress(): Promise<void> {
    await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify([]));
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(KEYS.SETTINGS);
      return data ? JSON.parse(data) : {
        fontSize: 16,
        readingMode: false,
        notificationsEnabled: true
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        fontSize: 16,
        readingMode: false,
        notificationsEnabled: true
      };
    }
  }

  async isDataAvailable(): Promise<boolean> {
    const categories = await this.getCategories();
    return categories.length > 0;
  }

  async clearAllData(): Promise<void> {
    await AsyncStorage.multiRemove([
      KEYS.CATEGORIES,
      KEYS.AZKAR_MORNING,
      KEYS.AZKAR_EVENING,
      KEYS.PROGRESS
    ]);
  }
}

export const mobileStorage = new MobileStorage();