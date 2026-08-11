export type CurriculumStatus = "DRAFT" | "PUBLISHED";

export type LessonStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED";

export interface CurriculumLanguage {
  id: string;
  name: string;
  code: string;
}

export interface CurriculumLevel {
  id: string;
  name: string;
  order: number;
  languageId: string;
  language: CurriculumLanguage;
}

export interface ChapterLessonTopic {
  id: string;
  name: string;
}

export interface ChapterLesson {
  id: string;
  title: string;
  status: LessonStatus;
  topicId: string;
  chapterId: string | null;
  orderInChapter: number | null;
  topic?: ChapterLessonTopic;
}

export interface CurriculumChapter {
  id: string;
  title: string;
  description: string | null;
  order: number;
  curriculumId: string;
  lessons: ChapterLesson[];
  createdAt: string;
  updatedAt: string;
}

export interface Curriculum {
  id: string;
  title: string;
  description: string | null;
  status: CurriculumStatus;
  levelId: string;
  level: CurriculumLevel;
  chapters: CurriculumChapter[];
  chapterCount: number;
  lessonCount: number;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumFilters {
  search?: string;
  languageId?: string;
  levelId?: string;
  status?: CurriculumStatus;
  page?: number;
  limit?: number;
}

export interface CreateCurriculumPayload {
  title: string;
  description?: string;
  status?: CurriculumStatus;
  levelId: string;
}

export interface UpdateCurriculumPayload {
  title?: string;
  description?: string;
  status?: CurriculumStatus;
  levelId?: string;
}

export interface CreateChapterPayload {
  title: string;
  description?: string;
  order: number;
}

export interface UpdateChapterPayload {
  title?: string;
  description?: string;
  order?: number;
}

export interface AssignLessonPayload {
  lessonId: string;
  orderInChapter: number;
}
