// User entity
export interface User {
  id: string
  username: string
  email: string
  display_name: string
  avatar_url?: string | null
  created_at?: string
}

export interface CreateUserDto {
  username: string
  email: string
  display_name: string
  avatar_url?: string | null
}

export interface UpdateUserDto {
  username?: string
  email?: string
  display_name?: string
  avatar_url?: string | null
}

// Conversation entity
export interface Conversation {
  id: string
  name: string
  type: 'channel' | 'person'
  avatar_url?: string | null
  created_at?: string
}

export interface CreateConversationDto {
  name: string
  type: 'channel' | 'person'
  avatar_url?: string | null
}

export interface UpdateConversationDto {
  name?: string
  type?: 'channel' | 'person'
  avatar_url?: string | null
}

// Message entity
export interface Message {
  id: string
  conversation_id: string
  author_id: string
  content: string
  is_ai: boolean
  task_proposal?: any | null // JSONB
  search_result?: any | null // JSONB
  created_at?: string
}

export interface CreateMessageDto {
  conversation_id: string
  author_id: string
  content: string
  is_ai?: boolean
  task_proposal?: any | null
  search_result?: any | null
}

export interface UpdateMessageDto {
  conversation_id?: string
  author_id?: string
  content?: string
  is_ai?: boolean
  task_proposal?: any | null
  search_result?: any | null
}

// Task entity
export interface Task {
  id: string
  message_id?: string | null
  task_id?: string | null
  action: 'create' | 'update' | 'comment'
  summary: string
  details?: string | null
  status: 'pending' | 'confirmed' | 'rejected'
  proposed_by: string
  created_at?: string
}

export interface CreateTaskDto {
  message_id?: string | null
  task_id?: string | null
  action: 'create' | 'update' | 'comment'
  summary: string
  details?: string | null
  status?: 'pending' | 'confirmed' | 'rejected'
  proposed_by: string
}

export interface UpdateTaskDto {
  message_id?: string | null
  task_id?: string | null
  action?: 'create' | 'update' | 'comment'
  summary?: string
  details?: string | null
  status?: 'pending' | 'confirmed' | 'rejected'
  proposed_by?: string
}
