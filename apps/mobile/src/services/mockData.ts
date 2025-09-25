import { Category, Zikr, CategorySlug } from '@azkar/shared';
import azkarData from '../data/hisn_almuslim.json';

class MockDataService {
  private categories: Category[] = [];
  private azkarByCategory: Record<CategorySlug, Zikr[]> = {
    morning: [],
    evening: []
  };
  private initialized = false;

  private init() {
    if (this.initialized) return;

    console.log('MockData: Initializing data...');

    // Create categories
    this.categories = [
      {
        id: 1,
        nameAr: 'أذكار الصباح',
        slug: 'morning',
        orderIndex: 1
      },
      {
        id: 2,
        nameAr: 'أذكار المساء',
        slug: 'evening',
        orderIndex: 2
      }
    ];

    // Process the azkar from JSON data
    const azkarSection = azkarData['أذكار الصباح والمساء'];
    console.log('MockData: Azkar section found:', !!azkarSection);
    if (azkarSection && azkarSection.text) {
      console.log('MockData: Processing azkar texts, count:', azkarSection.text.length);
      this.processAzkarTexts(azkarSection);
    } else {
      console.error('MockData: No azkar section found in JSON data');
    }

    console.log('MockData: Initialization complete');
    console.log('MockData: Morning azkar count:', this.azkarByCategory.morning.length);
    console.log('MockData: Evening azkar count:', this.azkarByCategory.evening.length);

    this.initialized = true;
  }

  private processAzkarTexts(azkarSection: any) {
    const textArray = azkarSection.text;
    const footnoteArray = azkarSection.footnote || [];

    const morningAzkar: Zikr[] = [];
    const eveningAzkar: Zikr[] = [];

    textArray.forEach((text: string, index: number) => {
      if (!text || text.trim().length === 0) return;

      const footnote = footnoteArray[index] || null;
      const repeatCount = this.extractRepeatCount(text);
      const cleanText = this.cleanText(text);

      // Create zikr for both morning and evening
      const morningZikr: Zikr = {
        id: (index + 1) * 100 + 1, // Unique ID for morning
        textAr: cleanText,
        footnoteAr: footnote,
        repeatMin: repeatCount,
        orderIndex: index + 1
      };

      const eveningZikr: Zikr = {
        id: (index + 1) * 100 + 2, // Unique ID for evening
        textAr: cleanText,
        footnoteAr: footnote,
        repeatMin: repeatCount,
        orderIndex: index + 1
      };

      morningAzkar.push(morningZikr);
      eveningAzkar.push(eveningZikr);
    });

    this.azkarByCategory.morning = morningAzkar;
    this.azkarByCategory.evening = eveningAzkar;
  }

  private extractRepeatCount(text: string): number {
    // Look for Arabic or English numbers followed by "مرات" or "مرة"
    const patterns = [
      /\(\s*([^)]*?)\s*مرا?ت?\s*\)/g, // (X مرات)
      /([٠-٩]+)\s*مرا?ت?/g, // Arabic numbers
      /(\d+)\s*مرا?ت?/g, // English numbers
    ];

    for (const pattern of patterns) {
      const match = pattern.exec(text);
      if (match) {
        const numberText = match[1].trim();
        const parsed = this.parseArabicNumber(numberText);
        if (parsed > 0) return parsed;
      }
    }

    // Check for specific text patterns
    if (text.includes('ثلاث مرات') || text.includes('ثلاث')) return 3;
    if (text.includes('أربع مرات') || text.includes('أربع')) return 4;
    if (text.includes('خمس مرات') || text.includes('خمس')) return 5;
    if (text.includes('ست مرات') || text.includes('ست')) return 6;
    if (text.includes('سبع مرات') || text.includes('سبع')) return 7;
    if (text.includes('عشر مرات') || text.includes('عشر')) return 10;
    if (text.includes('مائة مرة') || text.includes('مائة')) return 100;

    return 1; // Default
  }

  private parseArabicNumber(arabicNumber: string): number {
    // Convert Arabic numerals to regular numbers
    let englishNumber = arabicNumber
      .replace(/٠/g, '0')
      .replace(/١/g, '1')
      .replace(/٢/g, '2')
      .replace(/٣/g, '3')
      .replace(/٤/g, '4')
      .replace(/٥/g, '5')
      .replace(/٦/g, '6')
      .replace(/٧/g, '7')
      .replace(/٨/g, '8')
      .replace(/٩/g, '9');

    // Handle written numbers
    const writtenNumbers: Record<string, number> = {
      'ثلاث': 3, 'ثلاثة': 3,
      'أربع': 4, 'أربعة': 4,
      'خمس': 5, 'خمسة': 5,
      'ست': 6, 'ستة': 6,
      'سبع': 7, 'سبعة': 7,
      'ثمان': 8, 'ثمانية': 8,
      'تسع': 9, 'تسعة': 9,
      'عشر': 10, 'عشرة': 10,
      'مائة': 100
    };

    const trimmed = englishNumber.trim();
    if (writtenNumbers[trimmed]) {
      return writtenNumbers[trimmed];
    }

    try {
      return parseInt(englishNumber);
    } catch {
      return 1;
    }
  }

  private cleanText(text: string): string {
    // Remove repeat count patterns
    text = text.replace(/\(\s*.*?\s*مرا?ت?\s*\)/g, '').trim();
    text = text.replace(/([٠-٩]+|\d+)\s*مرا?ت?/g, '').trim();
    text = text.replace(/(ثلاث|أربع|خمس|ست|سبع|ثمان|تسع|عشر|مائة)\s*مرا?ت?/g, '').trim();

    // Clean extra whitespace
    text = text.replace(/\s+/g, ' ').trim();

    return text;
  }

  async getCategories(): Promise<Category[]> {
    this.init();
    return Promise.resolve(this.categories);
  }

  async getAzkarByCategory(categorySlug: CategorySlug): Promise<Zikr[]> {
    this.init();
    const azkar = this.azkarByCategory[categorySlug] || [];
    console.log(`MockData: Returning ${azkar.length} azkar for category ${categorySlug}`);
    return Promise.resolve(azkar);
  }

  async getHealth(): Promise<{ status: string }> {
    return Promise.resolve({ status: 'ok' });
  }
}

export const mockDataService = new MockDataService();