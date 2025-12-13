# How to Find Supabase API Keys

## Step-by-Step Guide

### Step 1: Go to Your Supabase Dashboard

1. Open your browser and go to: **https://supabase.com/dashboard**
2. Sign in to your account
3. Select your project (the one you're using for this backend)

### Step 2: Navigate to API Settings

1. In the left sidebar, click on **Settings** (gear icon at the bottom)
2. Click on **API** in the settings menu

### Step 3: Find Your Keys

You'll see a section called **Project API keys** with three important values:

#### 1. **Project URL**
- This is your `NEXT_PUBLIC_SUPABASE_URL`
- Example: `https://rbcfrjmkgmpmzraabggm.supabase.co`
- ✅ You already have this one

#### 2. **anon public** key
- This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- It's a long JWT token starting with `eyJ...`
- **Role:** `anon` (when decoded)
- **Use:** For client-side operations (respects RLS)
- ⚠️ **You're missing this one!**

#### 3. **service_role** key
- This is your `SUPABASE_SERVICE_ROLE_KEY`
- Also a long JWT token starting with `eyJ...`
- **Role:** `service_role` (when decoded)
- **Use:** For backend/server operations (bypasses RLS)
- ⚠️ **Make sure you use the service_role key, NOT the anon key!**

## Visual Guide

```
Supabase Dashboard
├── Settings (gear icon)
    └── API
        └── Project API keys
            ├── Project URL → NEXT_PUBLIC_SUPABASE_URL
            ├── anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY
            └── service_role → SUPABASE_SERVICE_ROLE_KEY
```

## How to Copy the Keys

1. **For anon key:**
   - Find the **anon public** key
   - Click the **copy icon** (📋) next to it
   - Or click **Reveal** if it's hidden, then copy

2. **For service_role key:**
   - Find the **service_role** key
   - Click the **copy icon** (📋) next to it
   - ⚠️ **Important:** Make sure you're copying the **service_role** key, not the anon key!

## Security Warning

⚠️ **IMPORTANT:**
- The **service_role** key has **FULL ACCESS** to your database
- It **bypasses all RLS policies**
- **NEVER** expose it in client-side code
- **NEVER** commit it to Git
- Only use it in backend/server code

## How to Verify You Have the Right Keys

### Method 1: Check the JWT Token

Both keys are JWT tokens. You can decode them to check the role:

1. Go to https://jwt.io
2. Paste your key in the "Encoded" section
3. Look at the "Payload" section
4. Check the `"role"` field:
   - Should be `"anon"` for anon key
   - Should be `"service_role"` for service_role key

### Method 2: Use the Check-Env Endpoint

After adding keys to your `.env` file and restarting server:

```bash
curl http://localhost:3000/api/check-env
```

This will show you:
- Which keys you have
- What role each key has
- If keys are swapped

## Your .env File Should Look Like:

```env
# Project URL
NEXT_PUBLIC_SUPABASE_URL=https://rbcfrjmkgmpmzraabggm.supabase.co

# Anon key (for client-side, respects RLS)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiY2Zyam1rZ21wbXpyYWFiZ2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzE2NzMsImV4cCI6MjA4MTIwNzY3M30.8hchBEKSU6avijWR9OvCQYqUzwOaf6MYAw1Cq4byM90

# Service role key (for backend, bypasses RLS)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiY2Zyam1rZ21wbXpyYWFiZ2dtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTYzMTY3MywiZXhwIjoyMDgxMjA3NjczfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Common Mistakes

❌ **Wrong:** Using anon key as service_role key
- This will cause RLS errors
- Your admin client won't bypass RLS

❌ **Wrong:** Using service_role key as anon key
- This works but is a security risk
- Service role key should only be in backend

✅ **Correct:** Using both keys correctly
- Anon key for client-side
- Service role key for backend/server

## Quick Checklist

- [ ] Opened Supabase Dashboard
- [ ] Went to Settings → API
- [ ] Found Project URL
- [ ] Found anon public key
- [ ] Found service_role key
- [ ] Copied anon key to `.env` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Copied service_role key to `.env` as `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Verified keys are different (not the same!)
- [ ] Restarted server after updating `.env`

## Still Can't Find It?

If you can't find the API section:
1. Make sure you're logged into the correct Supabase account
2. Make sure you've selected the correct project
3. The API section is always in Settings → API
4. If you don't see it, you might not have permission (contact project owner)

## Need Help?

After adding the keys:
1. Restart your server
2. Run: `curl http://localhost:3000/api/check-env`
3. Check the console logs when calling your API
4. Look for the verification messages in the logs

