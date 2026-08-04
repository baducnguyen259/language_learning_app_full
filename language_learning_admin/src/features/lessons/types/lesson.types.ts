export interface Lesson {
  id: string
  title: string
  language: string
  curriculum: string
  chapter: string
  level: string
  duration: number
  completion: number
  status: 'published' | 'editing' | 'draft' | 'incomplete'
  updatedAt: string
  thumbnail: string
}

export interface LessonFilters {
  search: string
  language: string
  level: string
  curriculum: string
  chapter: string
  status: string
}
