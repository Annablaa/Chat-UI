import { NextResponse } from 'next/server'

// GET /api/check-env - Check environment variables (without exposing secrets)
export async function GET() {
  const envCheck = {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT SET',
    anonKeyPreview: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...` 
      : 'NOT SET',
    serviceRoleKeyPreview: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...`
      : 'NOT SET',
    // Decode JWT to check the role (first part of JWT is header, second is payload)
    anonKeyRole: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? (() => {
          try {
            const payload = JSON.parse(
              Buffer.from(
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.split('.')[1], 
                'base64'
              ).toString()
            )
            return payload.role || 'unknown'
          } catch {
            return 'invalid'
          }
        })()
      : 'NOT SET',
    serviceRoleKeyRole: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? (() => {
          try {
            const payload = JSON.parse(
              Buffer.from(
                process.env.SUPABASE_SERVICE_ROLE_KEY.split('.')[1],
                'base64'
              ).toString()
            )
            return payload.role || 'unknown'
          } catch {
            return 'invalid'
          }
        })()
      : 'NOT SET',
  }

  return NextResponse.json({
    message: 'Environment variables check',
    environment: envCheck,
    issues: [
      !envCheck.hasAnonKey && '❌ Missing NEXT_PUBLIC_SUPABASE_ANON_KEY',
      !envCheck.hasServiceRoleKey && '❌ Missing SUPABASE_SERVICE_ROLE_KEY',
      envCheck.serviceRoleKeyRole === 'anon' && '⚠️ SUPABASE_SERVICE_ROLE_KEY appears to be an anon key (should be service_role)',
      envCheck.anonKeyRole !== 'anon' && envCheck.hasAnonKey && '⚠️ NEXT_PUBLIC_SUPABASE_ANON_KEY role is not "anon"',
    ].filter(Boolean),
  })
}

