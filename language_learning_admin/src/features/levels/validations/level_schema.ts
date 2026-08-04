import { z } from 'zod'

// Add fields after the backend DTO and form requirements are confirmed.
export const levelSchema = z.object({})

export type LevelFormValues = z.infer<typeof levelSchema>
