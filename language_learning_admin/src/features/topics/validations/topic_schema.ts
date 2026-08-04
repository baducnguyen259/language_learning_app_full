import { z } from 'zod'

// Add fields after the backend DTO and form requirements are confirmed.
export const topicSchema = z.object({})

export type TopicFormValues = z.infer<typeof topicSchema>
