export interface LanguageCount {
  levels: number;
}

export interface Language {
  id: string;
  name: string;
  code: string;
  _count?: LanguageCount;
  createdAt: string;
  updatedAt: string;
}

export interface LanguageFilters {
  search?: string;
  page?: number;
  limit?: number;
}
