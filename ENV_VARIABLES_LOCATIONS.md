# Environment Variable Usage Locations

## `NEXT_PUBLIC_SUPABASE_URL`

This environment variable is used in the following files:

### 1. `lib/supabase/client.ts`
**Line 3:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
```
**Usage:** Used to create the client-side Supabase client (line 8-10)
```typescript
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)
```

### 2. `lib/supabase/server.ts`
**Line 3:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
```
**Usage:** Used in `createServerClient()` function (line 13)
```typescript
return createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})
```

### 3. `lib/supabase/admin.ts`
**Line 3:**
```typescript
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
```
**Usage:** Used in `getSupabaseAdmin()` function (line 12)
```typescript
return createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

## Summary

`NEXT_PUBLIC_SUPABASE_URL` is used in **3 files**:
1. `lib/supabase/client.ts` - Client-side Supabase client
2. `lib/supabase/server.ts` - Server-side Supabase client (for API routes)
3. `lib/supabase/admin.ts` - Admin Supabase client (bypasses RLS)

All three files use it to initialize the Supabase client with the project URL.

