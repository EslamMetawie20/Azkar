export interface Category {
  id: number;
  nameAr: string;
  slug: string;
  orderIndex: number;
}

export interface Zikr {
  id: number;
  textAr: string;
  footnoteAr?: string;
  repeatMin: number;
  orderIndex: number;
}

export interface HealthResponse {
  status: string;
}

export type CategorySlug = 'morning' | 'evening';

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  surah: number;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
}

export interface SurahWithAyahs extends Surah {
  ayahs: Ayah[];
}

