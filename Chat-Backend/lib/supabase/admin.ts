import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Admin client with service role key - use with caution, has full access
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env or .env.local file')
  }
  
  // Verify the key is actually a service role key (not anon key)
  try {
    const payload = JSON.parse(
      Buffer.from(supabaseServiceRoleKey.split('.')[1], 'base64').toString()
    )
    if (payload.role !== 'service_role') {
      console.warn('⚠️ [ADMIN CLIENT] WARNING: SUPABASE_SERVICE_ROLE_KEY appears to be an anon key (role=' + payload.role + '). This will not bypass RLS!')
    } else {
      console.log('✅ [ADMIN CLIENT] Service role key verified (role=service_role)')
    }
  } catch (e) {
    console.warn('⚠️ [ADMIN CLIENT] Could not verify service role key format')
  }
  
  const client = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  console.log('🔌 [ADMIN CLIENT] Admin client created with service role key')
  return client
}

