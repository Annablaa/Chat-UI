# API Reference

## Base URL
- Development: `http://localhost:3000`
- Production: Your production URL

## Authentication
Currently, the API does not require authentication. Make sure your Supabase credentials are configured in `.env` or `.env.local`.

---

## Users API

### Get All Users
```http
GET /api/users
```

**Query Parameters:**
- `id` (optional) - Get user by ID
- `role` (optional) - Filter by role

**Example:**
```bash
GET /api/users
GET /api/users?id=123
GET /api/users?role=admin
```

**Response:**
```json
{
  "data": [
    {
      "id": "123",
      "name": "John Doe",
      "role": "user",
      "description": "User description"
    }
  ],
  "count": 1
}
```

### Create User
```http
POST /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "role": "user",
  "description": "User description" // optional
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "data": {
    "id": "123",
    "name": "John Doe",
    "role": "user",
    "description": "User description"
  }
}
```

### Update User
```http
PUT /api/users
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "123",
  "name": "Jane Doe", // optional
  "role": "admin", // optional
  "description": "Updated description" // optional
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "data": {
    "id": "123",
    "name": "Jane Doe",
    "role": "admin",
    "description": "Updated description"
  }
}
```

### Delete User
```http
DELETE /api/users?id=123
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

---

## Messages API

### Get All Messages
```http
GET /api/messages
```

**Query Parameters:**
- `id_message` (optional) - Get message by ID
- `id_chatnumb` (optional) - Filter by chat number
- `id_user` (optional) - Filter by user ID

**Example:**
```bash
GET /api/messages
GET /api/messages?id_message=456
GET /api/messages?id_chatnumb=chat123
GET /api/messages?id_user=123
```

**Response:**
```json
{
  "data": [
    {
      "id_message": "456",
      "id_chatnumb": "chat123",
      "id_user": "123",
      "message_date": "2025-12-13T15:12:02.858Z",
      "content": "Hello, this is a message",
      "is_edited": false
    }
  ],
  "count": 1
}
```

### Create Message
```http
POST /api/messages
Content-Type: application/json
```

**Request Body:**
```json
{
  "id_chatnumb": "chat123",
  "id_user": "123",
  "content": "Hello, this is a message",
  "message_date": "2025-12-13T15:12:02.858Z", // optional, defaults to current date
  "is_edited": false // optional, defaults to false
}
```

**Response:**
```json
{
  "message": "Message created successfully",
  "data": {
    "id_message": "456",
    "id_chatnumb": "chat123",
    "id_user": "123",
    "message_date": "2025-12-13T15:12:02.858Z",
    "content": "Hello, this is a message",
    "is_edited": false
  }
}
```

### Update Message
```http
PUT /api/messages
Content-Type: application/json
```

**Request Body:**
```json
{
  "id_message": "456",
  "content": "Updated message content", // optional
  "id_chatnumb": "chat123", // optional
  "id_user": "123", // optional
  "message_date": "2025-12-13T15:12:02.858Z", // optional
  "is_edited": true // optional, automatically set to true if content is updated
}
```

**Response:**
```json
{
  "message": "Message updated successfully",
  "data": {
    "id_message": "456",
    "id_chatnumb": "chat123",
    "id_user": "123",
    "message_date": "2025-12-13T15:12:02.858Z",
    "content": "Updated message content",
    "is_edited": true
  }
}
```

### Delete Message
```http
DELETE /api/messages?id_message=456
```

**Response:**
```json
{
  "message": "Message deleted successfully"
}
```

---

## Other Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Backend is running",
  "timestamp": "2025-12-13T15:12:02.858Z"
}
```

### Test Supabase Connection
```http
GET /api/test
```

**Response:**
```json
{
  "message": "Supabase connection successful!",
  "data": []
}
```

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "message": "Missing required fields: name and role are required"
}
```

**404 Not Found:**
```json
{
  "message": "User not found",
  "error": "Error details"
}
```

**500 Server Error:**
```json
{
  "message": "Error creating user",
  "error": "Error details"
}
```

---

## Interactive API Documentation

Visit **http://localhost:3000/api-docs** to access the interactive Swagger UI where you can:
- View all endpoints
- See request/response schemas
- Test endpoints directly from the browser

