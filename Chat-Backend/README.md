# Chatio - Next.js Backend with Supabase

A Next.js project configured as a backend with Supabase database integration.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

- `GET /api/health` - Health check endpoint
- `GET /api/test` - Test Supabase connection

## Supabase Client

The project includes three Supabase client configurations:

- **Client** (`lib/supabase/client.ts`) - For client-side usage
- **Server** (`lib/supabase/server.ts`) - For server-side usage with cookie handling
- **Admin** (`lib/supabase/admin.ts`) - For admin operations with service role key

## Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to Settings > API
3. Copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

