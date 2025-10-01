import { Surah, SurahWithAyahs } from '../types';

const ALQURAN_API_BASE = 'https://api.alquran.cloud/v1';

interface ApiResponse<T> {
  code: number;
  status: string;
  data: T;
}

export class QuranApi {
  async getSurahs(): Promise<Surah[]> {
    try {
      const response = await fetch(`${ALQURAN_API_BASE}/surah`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as ApiResponse<Surah[]>;
      return data.data;
    } catch (error) {
      console.error('Failed to fetch surahs:', error);
      throw error;
    }
  }

  async getSurah(surahNumber: number): Promise<SurahWithAyahs> {
    try {
      const response = await fetch(`${ALQURAN_API_BASE}/surah/${surahNumber}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json() as ApiResponse<SurahWithAyahs>;
      return data.data;
    } catch (error) {
      console.error(`Failed to fetch surah ${surahNumber}:`, error);
      throw error;
    }
  }
}

export const quranApi = new QuranApi();