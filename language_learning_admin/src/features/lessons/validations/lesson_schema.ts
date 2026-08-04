import { z } from 'zod'

// Add fields after the backend DTO and form requirements are confirmed.
export const lessonSchema = z.object({})

export type LessonFormValues = z.infer<typeof lessonSchema>
