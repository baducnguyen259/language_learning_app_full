export type VocabularyStatus = 'active' | 'draft'

export interface Vocabulary {
  id: string
  korean: string
  pronunciation: string
  vietnamese: string
  wordType: string
  image: string
  status: VocabularyStatus
  level: string
  topic: string
  lesson: string
}

export interface VocabularyFilters {
  search: string
  level: string
  topic: string
  lesson: string
  wordType: string
}
