import { z } from 'zod'

// Add fields after the backend DTO and form requirements are confirmed.
export const userSchema = z.object({})

export type UserFormValues = z.infer<typeof userSchema>
