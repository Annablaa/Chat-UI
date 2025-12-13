# Debugging Guide - Testing Supabase Connection

## Available Debug Endpoints

### 1. `/api/debug` - Comprehensive Debug Endpoint ⭐ **RECOMMENDED**

This endpoint runs multiple tests and provides detailed information:

```bash
curl http://localhost:3000/api/debug
```

**What it tests:**
- ✅ Environment variables (URL, keys)
- ✅ Server client connection
- ✅ Admin client connection  
- ✅ Table existence (user, messages)
- ✅ Read operation test
- ✅ Sample data retrieval

**Response includes:**
- Environment check status
- Individual test results
- Connection status
- Table existence
- Record counts
- Sample data

### 2. `/api/test` - Simple Connection Test

Quick test to verify basic connection:

```bash
curl http://localhost:3000/api/test
```

**What it tests:**
- ✅ Basic Supabase connection
- ✅ Query execution
- ✅ Table access

### 3. `/api/users` - Test with Real Operations

Test actual CRUD operations:

```bash
# GET - Read test
curl http://localhost:3000/api/users

# POST - Create test
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","role":"developer"}'
```

## Console Logs

All endpoints now include detailed console logging. Check your terminal/server logs to see:

- 🔍 Request received
- 🔌 Client creation
- 📊 Query execution
- ✅ Success messages
- ❌ Error messages with details

## What to Look For

### ✅ Success Indicators:
```
✅ [TEST] Connection test successful!
✅ [USERS API] User created successfully
📊 [TEST] Sample data: {...}
```

### ❌ Error Indicators:
```
❌ [TEST] Connection error: ...
❌ [USERS API] Error creating user: ...
⚠️ [TEST] Query failed: ...
```

## Common Issues

### 1. "Missing Supabase environment variables"
**Fix:** Check your `.env` file has:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (for write operations)

### 2. "Table does not exist"
**Fix:** Create tables in Supabase dashboard or run SQL schema

### 3. "Row-level security policy violation"
**Fix:** Use admin client (already implemented) or disable RLS

### 4. "Connection timeout"
**Fix:** Check your Supabase URL and network connection

## Viewing Logs

### Development Mode:
```bash
npm run dev
# Logs appear in terminal
```

### Production Mode:
```bash
npm start
# Check server logs/console
```

## Quick Test Commands

```bash
# 1. Comprehensive debug test
curl http://localhost:3000/api/debug | jq

# 2. Simple connection test
curl http://localhost:3000/api/test

# 3. Test reading users
curl http://localhost:3000/api/users

# 4. Test creating user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Debug Test","role":"tester"}'
```

## Interpreting Results

### Debug Endpoint Response:
```json
{
  "timestamp": "2025-12-13T...",
  "environment": {
    "hasSupabaseUrl": true,
    "hasAnonKey": true,
    "hasServiceRoleKey": true
  },
  "tests": {
    "serverClient": { "status": "success", "canConnect": true },
    "adminClient": { "status": "success", "canConnect": true },
    "tables": {
      "user": { "exists": true, "status": "✅ Table exists" },
      "messages": { "exists": true, "status": "✅ Table exists" }
    },
    "readOperation": {
      "status": "success",
      "recordCount": 5,
      "canRead": true
    }
  },
  "summary": {
    "allTestsPassed": true,
    "status": "✅ All tests passed!"
  }
}
```

If `allTestsPassed: true`, your backend is properly connected! 🎉

