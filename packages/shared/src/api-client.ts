import { Category, Zikr, HealthResponse, CategorySlug } from './types';

export class AzkarApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8080') {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  private async request<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);

      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      return await response.json() as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        0
      );
    }
  }

  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/v1/categories');
  }

  async getCategoryBySlug(slug: string): Promise<Category> {
    return this.request<Category>(`/api/v1/categories/${slug}`);
  }

  async getAzkarByCategory(category: CategorySlug): Promise<Zikr[]> {
    return this.request<Zikr[]>(`/api/v1/azkar?category=${category}`);
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/api/v1/health');
  }
}

// Factory function for creating API client instances
export function createApi(baseUrl?: string): AzkarApiClient {
  return new AzkarApiClient(baseUrl);
}

// Custom error class
export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}