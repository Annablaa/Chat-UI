# Row Level Security (RLS) Policy Explanation

## What is RLS?

**Row Level Security (RLS)** is a **Supabase database policy**, not a code policy. It's a PostgreSQL feature that controls who can read/write which rows in your tables.

## The Error You're Seeing

```
new row violates row-level security policy for table "user"
Error code: 42501 (insufficient privilege)
```

This means:
- ✅ Your code is working correctly
- ✅ The connection to Supabase is successful
- ❌ The database is blocking the INSERT because of RLS policies

## Why Is This Happening?

Even though we're using the **admin client** (service role key), the error suggests:

1. **The service role key might be incorrect** - If your `SUPABASE_SERVICE_ROLE_KEY` is actually the anon key, RLS will still apply
2. **RLS is enabled** on the `user` table in Supabase
3. **No policy allows INSERT** operations

## How to Check Your Keys

Run this to verify your environment variables:

```bash
curl http://localhost:3000/api/check-env
```

This will show:
- Which keys you have
- What role each key has (should be "anon" and "service_role")
- Any issues detected

## Solutions

### Option 1: Fix Your Service Role Key (Recommended)

1. Go to Supabase Dashboard → Settings → API
2. Find the **service_role** key (NOT the anon key)
3. The service_role key should decode to show `"role":"service_role"` (not `"role":"anon"`)
4. Update your `.env` file:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
   ```
5. Restart your server

### Option 2: Disable RLS (Development Only)

Run this SQL in Supabase SQL Editor:

```sql
-- Disable RLS on user table
ALTER TABLE public.user DISABLE ROW LEVEL SECURITY;

-- Disable RLS on messages table  
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
```

⚠️ **Warning:** Only do this for development! In production, use proper RLS policies.

### Option 3: Create RLS Policies (Production Ready)

Run this SQL in Supabase SQL Editor:

```sql
-- Allow service role to do everything (for backend API)
CREATE POLICY "Service role full access" ON public.user
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');

-- Same for messages table
CREATE POLICY "Service role full access" ON public.messages
    FOR ALL
    USING (auth.role() = 'service_role')
    WITH CHECK (auth.role() = 'service_role');
```

### Option 4: Allow All Operations (Development Only)

```sql
-- Allow all operations on user table
CREATE POLICY "Allow all operations" ON public.user
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Same for messages
CREATE POLICY "Allow all operations" ON public.messages
    FOR ALL
    USING (true)
    WITH CHECK (true);
```

## How to Check Current RLS Status

Run this SQL in Supabase SQL Editor:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('user', 'messages');

-- Check existing policies
SELECT * FROM pg_policies 
WHERE tablename IN ('user', 'messages');
```

## Quick Test

After fixing, test with:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","role":"developer"}'
```

## Summary

- **RLS is a database feature**, not code
- **Service role key should bypass RLS** - if it doesn't, the key is wrong
- **Check your keys** with `/api/check-env`
- **Fix by**: Using correct service role key OR disabling/updating RLS policies

