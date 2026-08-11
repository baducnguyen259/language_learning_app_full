export interface LevelLanguage {
  id: string;
  name: string;
  code: string;
}

export interface LevelCount {
  topics: number;
}

export interface Level {
  id: string;
  name: string;
  order: number;
  languageId: string;
  language?: LevelLanguage;
  _count?: LevelCount;
  createdAt: string;
  updatedAt: string;
}

export interface LevelFilters {
  search?: string;
  languageId?: string;
  page?: number;
  limit?: number;
}
