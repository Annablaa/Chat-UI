# Fix Environment Variables Issue

## Problem
Your `.env` file is missing `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## Current .env file has:
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ❌ Missing: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` (but the value looks like anon key)

## Solution

### Step 1: Get Your Keys from Supabase

1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. You'll see:
   - **Project URL** → This is your `NEXT_PUBLIC_SUPABASE_URL` ✅ (you have this)
   - **anon public** key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY` ❌ (you're missing this)
   - **service_role** key → This is your `SUPABASE_SERVICE_ROLE_KEY` (make sure you use the correct one)

### Step 2: Update Your .env File

Your `.env` file should have **all three** variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://rbcfrjmkgmpmzraabggm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Important Notes

⚠️ **The anon key and service role key are DIFFERENT:**
- **anon key** - Starts with `eyJ...` and has `"role":"anon"` in the decoded JWT
- **service_role key** - Also starts with `eyJ...` but has `"role":"service_role"` in the decoded JWT

⚠️ **Make sure you're using the correct keys!**

### Step 4: Restart Your Server

After updating `.env`, you **MUST restart** your Next.js server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
# or
npm start
```

Next.js only reads environment variables when it starts, so changes won't take effect until you restart.

## Quick Check

After updating, test with:
```bash
curl http://localhost:3000/api/debug
```

You should see:
```json
{
  "environment": {
    "hasSupabaseUrl": true,
    "hasAnonKey": true,  // Should be true now!
    "hasServiceRoleKey": true
  }
}
```

