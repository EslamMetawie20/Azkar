import type { Category, Zikr } from '@azkar/shared';

interface HisnAlmuslimSection {
  text: string[];
  footnote: string[];
}

interface HisnAlmuslimData {
  [key: string]: HisnAlmuslimSection;
}

export async function loadAzkarData(): Promise<{ categories: Category[]; morningAzkar: Zikr[]; eveningAzkar: Zikr[] }> {
  try {
    const response = await fetch('/hisn_almuslim.json');
    if (!response.ok) {
      throw new Error('Failed to load azkar data');
    }
    const data: HisnAlmuslimData = await response.json();

    // Extract morning and evening azkar from "أذكار الصباح والمساء" section
    const morningEveningSection = data['أذكار الصباح والمساء'];

    if (!morningEveningSection) {
      throw new Error('Morning/evening section not found in data');
    }

    // Create categories
    const categories: Category[] = [
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

    // Transform text and footnotes into Zikr objects
    const azkar: Zikr[] = morningEveningSection.text.map((text, index) => {
      // Extract repeat count from the text if it exists
      let repeatMin = 1;
      let cleanText = text;

      // Check for repeat patterns in the text
      const repeatPatterns = [
        { pattern: /\(\s*ثلاث مرات\s*\)/g, count: 3 },
        { pattern: /\(\s*سبع مرات\s*\)/g, count: 7 },
        { pattern: /\(\s*عشر مرات\s*\)/g, count: 10 },
        { pattern: /\(\s*مائة مرة\s*\)/g, count: 100 },
        { pattern: /\(\s*أربع مرات\s*\)/g, count: 4 },
      ];

      for (const { pattern, count } of repeatPatterns) {
        if (pattern.test(text)) {
          repeatMin = count;
          cleanText = text.replace(pattern, '').trim();
          break;
        }
      }

      return {
        id: index + 1,
        textAr: cleanText,
        footnoteAr: morningEveningSection.footnote[index] || undefined,
        repeatMin,
        orderIndex: index + 1
      };
    });

    // Both morning and evening use the same azkar (they share the same section)
    return {
      categories,
      morningAzkar: azkar,
      eveningAzkar: azkar
    };
  } catch (error) {
    console.error('Failed to load azkar data:', error);
    throw error;
  }
}
