import { z } from 'zod'

// Add fields after the backend DTO and form requirements are confirmed.
export const languageSchema = z.object({})

export type LanguageFormValues = z.infer<typeof languageSchema>
