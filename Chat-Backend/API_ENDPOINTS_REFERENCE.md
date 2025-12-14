# API Endpoints Reference

Complete list of all API endpoints with request and response types.

---

## Health & Testing

### GET `/api/health`
**Description:** Health check endpoint

**Request:**
- Method: `GET`
- Headers: None required
- Query Parameters: None
- Request Body: None

**Response:**
```typescript
{
  status: string        // "ok"
  message: string      // "Backend is running"
  timestamp: string     // ISO date-time
}
```

---

### GET `/api/test`
**Description:** Test Supabase connection

**Request:**
- Method: `GET`
- Headers: None required
- Query Parameters: None
- Request Body: None

**Response:**
```typescript
{
  message: string
  data?: any[]
  connectionStatus: string
  queryStatus?: string
  recordCount?: number
}
```

---

## Users

### GET `/api/users`
**Description:** Get all users or filter by query parameters

**Request:**
- Method: `GET`
- Headers: `accept: application/json`
- Query Parameters:
  - `id` (optional, string): Filter by user ID
  - `username` (optional, string): Filter by username
  - `email` (optional, string): Filter by email
- Request Body: None

**Response:**
```typescript
{
  data: User[]
  count: number
}

// User type:
{
  id: string
  username: string
  email: string
  display_name: string
  avatar_url?: string | null
  created_at?: string
}
```

**Example:**
- `GET /api/users`
- `GET /api/users?id=550e8400-e29b-41d4-a716-446655440000`
- `GET /api/users?username=johndoe`
- `GET /api/users?email=john@example.com`

---

### POST `/api/users`
**Description:** Create a new user (ID auto-generated as UUID)

**Request:**
- Method: `POST`
- Headers: 
  - `Content-Type: application/json`
  - `accept: application/json`
- Query Parameters: None
- Request Body:
```typescript
{
  username: string           // Required
  email: string              // Required
  display_name: string       // Required
  avatar_url?: string | null // Optional
}
```

**Response:**
```typescript
{
  message: string            // "User created successfully"
  data: User
}
```
Status: `201 Created`

---

### PUT `/api/users`
**Description:** Update an existing user

**Request:**
- Method: `PUT`
- Headers: 
  - `Content-Type: application/json`
  - `accept: application/json`
- Query Parameters: None
- Request Body:
```typescript
{
  id: string                 // Required
  username?: string          // Optional
  email?: string             // Optional
  display_name?: string      // Optional
  avatar_url?: string | null // Optional
}
```

**Response:**
```typescript
{
  message: string            // "User updated successfully"
  data: User
}
```
Status: `200 OK`

---

### DELETE `/api/users`
**Description:** Delete a user by ID

**Request:**
- Method: `DELETE`
- Headers: `accept: application/json`
- Query Parameters:
  - `id` (required, string): User ID to delete
- Request Body: None

**Response:**
```typescript
{
  message: string            // "User deleted successfully"
}
```
Status: `200 OK`

**Example:**
- `DELETE /api/users?id=550e8400-e29b-41d4-a716-446655440000`

---

## Conversations

### GET `/api/conversations`
**Description:** Get all conversations or filter by query parameters

**Request:**
- Method: `GET`
- Headers: `accept: application/json`
- Query Parameters:
  - `id` (optional, string): Filter by conversation ID
  - `type` (optional, "channel" | "person"): Filter by type
- Request Body: None

**Response:**
```typescript
{
  data: Conversation[]
  count: number
}

// Conversation type:
{
  id: string
  name: string
  type: "channel" | "person"
  avatar_url?: string | null
  created_at?: string
}
```

**Example:**
- `GET /api/conversations`
- `GET /api/conversations?id=550e8400-e29b-41d4-a716-446655440000`
- `GET /api/conversations?type=channel`
- `GET /api/conversations?type=person`

---

### POST `/api/conversations`
**Description:** Create a new conversation (ID auto-generated as UUID)

**Request:**
- Method: `POST`
- Headers: 
  - `Content-Type: application/json`
  - `accept: application/json`
- Query Parameters: None
- Request Body:
```typescript
{
  name: string               // Required
  type: "channel" | "person" // Required
  avatar_url?: string | null // Optional
}
```

**Response:**
```typescript
{
  message: string            // "Conversation created successfully"
  data: Conversation
}
```
Status: `201 Created`

---

### PUT `/api/conversations`
**Description:** Update an existing conversation

**Request:**
- Method: `PUT`
- Headers: 
  - `Content-Type: application/json`
  - `accept: application/json`
- Query Parameters: None
- Request Body:
```typescript
{
  id: string                 // Required
  name?: string              // Optional
  type?: "channel" | "person" // Optional
  avatar_url?: string | null // Optional
}
```

**Response:**
```typescript
{
  message: string            // "Conversation updated successfully"
  data: Conversation
}
```
Status: `200 OK`

---

### DELETE `/api/conversations`
**Description:** Delete a conversation by ID

**Request:**
- Method: `DELETE`
- Headers: `accept: application/json`
- Query Parameters:
  - `id` (required, string): Conversation ID to delete
- Request Body: None

**Response:**
```typescript
{
  message: string            // "Conversation deleted successfully"
}
```
Status: `200 OK`

**Example:**
- `DELETE /api/conversations?id=550e8400-e29b-41d4-a716-446655440000`

---

## Messages

### GET `/api/messages`
**Description:** Get all messages or filter by query parameters

**Request:**
- Method: `GET`
- Headers: `accept: application/json`
- Query Parameters:
  - `id` (optional, string): Filter by message ID
  - `conversation_id` (optional, string): Filter by conversation ID
  - `author_id` (optional, string): Filter by author ID
- Request Body: None

**Response:**
```typescript
{
  data: Message[]
  count: number
}

// Message type:
{
  id: string
  conversation_id: string
  author_id: string
  content: string
  is_ai: boolean
  task_proposal?: any | null    // JSONB
  search_result?: any | null    // JSONB
  created_at?: string
}
```

**Example:**
- `GET /api/messages`
- `GET /api/messages?id=550e8400-e29b-41d4-a716-446655440000`
- `GET /api/messages?conversation_id=550e8400-e29b-41d4-a716-446655440001`
- `GET /api/messages?author_id=550e8400-e29b-41d4-a716-446655440002`

---

### POST `/api/messages`
**Description:** Create a new message (ID auto-generated as UUID)

**Request:**
- Method: `POST`
- Headers: 
  - `Content-Type: application/json`
  - `accept: application/json`
- Query Parameters: None
- Request Body:
```typescript
{
  conversation_id: string     // Required
  author_id: string          // Required
  content: string            // Required
  is_ai?: boolean           // Optional, defaults to false
  task_proposal?: any | null // Optional, JSONB
  search_result?: any | null // Optional, JSONB
}
```

**Response:**
```typescript
{
  message: string            // "Message created successfully"
  data: Message
}
```
Status: `201 Created`

---

### PUT `/api/messages`
**Description:** Update an existing message

**Request:**
- Method: `PUT`
- Headers: 
  - `Content-Type: application/json`
  - `accept: application/json`
- Query Parameters: None
- Request Body:
```typescript
{
  id: string                 // Required
  conversation_id?: string   // Optional
  author_id?: string         // Optional
  content?: string           // Optional
  is_ai?: boolean           // Optional
  task_proposal?: any | null // Optional, JSONB
  search_result?: any | null // Optional, JSONB
}
```

**Response:**
```typescript
{
  message: string            // "Message updated successfully"
  data: Message
}
```
Status: `200 OK`

---

### DELETE `/api/messages`
**Description:** Delete a message by ID

**Request:**
- Method: `DELETE`
- Headers: `accept: application/json`
- Query Parameters:
  - `id` (required, string): Message ID to delete
- Request Body: None

**Response:**
```typescript
{
  message: string            // "Message deleted successfully"
}
```
Status: `200 OK`

**Example:**
- `DELETE /api/messages?id=550e8400-e29b-41d4-a716-446655440000`

---

## Tasks

### GET `/api/tasks`
**Description:** Get all tasks or filter by query parameters

**Request:**
- Method: `GET`
- Headers: `accept: application/json`
- Query Parameters:
  - `id` (optional, string): Filter by task ID
  - `status` (optional, "pending" | "confirmed" | "rejected"): Filter by status
  - `proposed_by` (optional, string): Filter by user ID who proposed the task
  - `message_id` (optional, string): Filter by message ID
- Request Body: None

**Response:**
```typescript
{
  data: Task[]
  count: number
}

// Task type:
{
  id: string
  message_id?: string | null
  task_id?: string | null
  action: "create" | "update" | "comment"
  summary: string
  details?: string | null
  status: "pending" | "confirmed" | "rejected"
  proposed_by: string
  created_at?: string
}
```

**Example:**
- `GET /api/tasks`
- `GET /api/tasks?id=550e8400-e29b-41d4-a716-446655440000`
- `GET /api/tasks?status=pending`
- `GET /api/tasks?proposed_by=550e8400-e29b-41d4-a716-446655440002`
- `GET /api/tasks?message_id=550e8400-e29b-41d4-a716-446655440001`

---

### POST `/api/tasks`
**Description:** Create a new task (ID auto-generated as UUID)

**Request:**
- Method: `POST`
- Headers: 
  - `Content-Type: application/json`
  - `accept: application/json`
- Query Parameters: None
- Request Body:
```typescript
{
  message_id?: string | null              // Optional
  task_id?: string | null                // Optional
  action: "create" | "update" | "comment" // Required
  summary: string                        // Required
  details?: string | null                // Optional
  status?: "pending" | "confirmed" | "rejected" // Optional, defaults to "pending"
  proposed_by: string                    // Required
}
```

**Response:**
```typescript
{
  message: string            // "Task created successfully"
  data: Task
}
```
Status: `201 Created`

---

### PUT `/api/tasks`
**Description:** Update an existing task

**Request:**
- Method: `PUT`
- Headers: 
  - `Content-Type: application/json`
  - `accept: application/json`
- Query Parameters: None
- Request Body:
```typescript
{
  id: string                 // Required
  message_id?: string | null // Optional
  task_id?: string | null    // Optional
  action?: "create" | "update" | "comment" // Optional
  summary?: string           // Optional
  details?: string | null    // Optional
  status?: "pending" | "confirmed" | "rejected" // Optional
  proposed_by?: string       // Optional
}
```

**Response:**
```typescript
{
  message: string            // "Task updated successfully"
  data: Task
}
```
Status: `200 OK`

---

### DELETE `/api/tasks`
**Description:** Delete a task by ID

**Request:**
- Method: `DELETE`
- Headers: `accept: application/json`
- Query Parameters:
  - `id` (required, string): Task ID to delete
- Request Body: None

**Response:**
```typescript
{
  message: string            // "Task deleted successfully"
}
```
Status: `200 OK`

**Example:**
- `DELETE /api/tasks?id=550e8400-e29b-41d4-a716-446655440000`

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```typescript
{
  message: string  // Error description
}
```

### 404 Not Found
```typescript
{
  message: string  // "Resource not found"
  error?: string   // Error details
}
```

### 500 Server Error
```typescript
{
  message: string  // "Error message"
  error: string    // Error details
}
```

---

## Type Definitions Summary

```typescript
// User
interface User {
  id: string
  username: string
  email: string
  display_name: string
  avatar_url?: string | null
  created_at?: string
}

// Conversation
interface Conversation {
  id: string
  name: string
  type: "channel" | "person"
  avatar_url?: string | null
  created_at?: string
}

// Message
interface Message {
  id: string
  conversation_id: string
  author_id: string
  content: string
  is_ai: boolean
  task_proposal?: any | null
  search_result?: any | null
  created_at?: string
}

// Task
interface Task {
  id: string
  message_id?: string | null
  task_id?: string | null
  action: "create" | "update" | "comment"
  summary: string
  details?: string | null
  status: "pending" | "confirmed" | "rejected"
  proposed_by: string
  created_at?: string
}
```

---

## Base URL

- Development: `http://localhost:3000`
- Production: Your production URL

## Interactive Documentation

View and test all endpoints in Swagger UI:
**http://localhost:3000/api-docs**

