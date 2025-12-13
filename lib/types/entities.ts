// User entity
export interface User {
  id: string | number
  name: string
  role: string
  description?: string | null
}

export interface CreateUserDto {
  name: string
  role: string
  description?: string | null
}

export interface UpdateUserDto {
  name?: string
  role?: string
  description?: string | null
}

// Message entity
export interface Message {
  id_message: string | number
  id_chatnumb: string | number
  id_user: string | number
  message_date: string // ISO date string
  content: string
  is_edited: boolean
}

export interface CreateMessageDto {
  id_chatnumb: string | number
  id_user: string | number
  content: string
  message_date: string // Optional, will default to current date if not provided
  is_edited?: boolean // Defaults to false
}

export interface UpdateMessageDto {
  id_chatnumb?: string | number
  id_user?: string | number
  content?: string
  message_date?: string
  is_edited?: boolean
}

