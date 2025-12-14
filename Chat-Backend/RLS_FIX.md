# Row Level Security (RLS) Fix

## Problem
You're getting the error: `"new row violates row-level security policy for table \"user\""`

This happens because Row Level Security (RLS) is enabled on your Supabase tables, but there are no policies allowing INSERT/UPDATE/DELETE operations.

## Solution Applied
The code has been updated to use the **admin client** (service role key) for all write operations (POST, PUT, DELETE). This bypasses RLS since the service role key has full access.

## Alternative: Fix RLS Policies in Supabase

If you prefer to use RLS policies instead, you can run this SQL in your Supabase SQL Editor:

### Option 1: Allow All Operations (Development Only)
```sql
-- Allow all operations on user table
CREATE POLICY "Allow all operations on user" ON public.user
    FOR ALL USING (true) WITH CHECK (true);

-- Allow all operations on messages table
CREATE POLICY "Allow all operations on messages" ON public.messages
    FOR ALL USING (true) WITH CHECK (true);
```

### Option 2: Disable RLS (Development Only)
```sql
-- Disable RLS on user table
ALTER TABLE public.user DISABLE ROW LEVEL SECURITY;

-- Disable RLS on messages table
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
```

### Option 3: Create Specific Policies (Production)
For production, create more restrictive policies based on your needs:

```sql
-- Allow authenticated users to read
CREATE POLICY "Users can read user table" ON public.user
    FOR SELECT USING (true);

-- Allow service role to write (for backend API)
CREATE POLICY "Service role can write user table" ON public.user
    FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
```

## Current Implementation
The backend now uses:
- **Regular client** (anon key) for READ operations (GET)
- **Admin client** (service role key) for WRITE operations (POST, PUT, DELETE)

This is the recommended approach for backend APIs as it:
- Keeps RLS enabled for security
- Allows backend to perform all operations
- Maintains separation between public and admin access

## Required Environment Variable
Make sure you have `SUPABASE_SERVICE_ROLE_KEY` in your `.env` or `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

You can find the service role key in your Supabase dashboard:
1. Go to Settings > API
2. Copy the `service_role` key (keep this secret!)

