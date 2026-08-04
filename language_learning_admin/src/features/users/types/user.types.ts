export interface User {
  id: string
  name: string
  email: string
  initials: string
  avatarColor: string
  course: string
  level: string
  progress: number
  streak: number
  status: 'active' | 'locked'
}

export interface UserFilters {
  search: string
  level: string
  language: string
  status: string
}
