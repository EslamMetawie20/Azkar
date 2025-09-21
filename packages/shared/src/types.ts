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

