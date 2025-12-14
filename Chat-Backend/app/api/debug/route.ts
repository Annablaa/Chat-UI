import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

// GET /api/debug - Debug endpoint to test Supabase connection
export async function GET() {
  const debugInfo: any = {
    timestamp: new Date().toISOString(),
    environment: {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL 
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...` 
        : 'NOT SET',
    },
    tests: {},
  }

  console.log('🔍 [DEBUG] Starting Supabase connection tests...')
  console.log('📋 [DEBUG] Environment check:', {
    hasUrl: debugInfo.environment.hasSupabaseUrl,
    hasAnonKey: debugInfo.environment.hasAnonKey,
    hasServiceKey: debugInfo.environment.hasServiceRoleKey,
  })

  // Test 1: Server Client Connection
  try {
    console.log('🧪 [TEST 1] Testing server client connection...')
    const supabase = createServerClient()
    const { data, error } = await supabase.from('user').select('count').limit(1)
    
    debugInfo.tests.serverClient = {
      status: error ? 'failed' : 'success',
      error: error?.message || null,
      canConnect: !error,
      message: error 
        ? `❌ Failed: ${error.message}` 
        : '✅ Server client connected successfully',
    }
    
    console.log('📊 [TEST 1] Result:', debugInfo.tests.serverClient)
  } catch (error: any) {
    debugInfo.tests.serverClient = {
      status: 'error',
      error: error.message,
      canConnect: false,
      message: `❌ Error: ${error.message}`,
    }
    console.error('❌ [TEST 1] Error:', error.message)
  }

  // Test 2: Admin Client Connection
  try {
    console.log('🧪 [TEST 2] Testing admin client connection...')
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin.from('user').select('count').limit(1)
    
    debugInfo.tests.adminClient = {
      status: error ? 'failed' : 'success',
      error: error?.message || null,
      canConnect: !error,
      message: error 
        ? `❌ Failed: ${error.message}` 
        : '✅ Admin client connected successfully',
    }
    
    console.log('📊 [TEST 2] Result:', debugInfo.tests.adminClient)
  } catch (error: any) {
    debugInfo.tests.adminClient = {
      status: 'error',
      error: error.message,
      canConnect: false,
      message: `❌ Error: ${error.message}`,
    }
    console.error('❌ [TEST 2] Error:', error.message)
  }

  // Test 3: Table Existence Check
  try {
    console.log('🧪 [TEST 3] Checking if tables exist...')
    const supabaseAdmin = getSupabaseAdmin()
    
    const tables = ['user', 'messages']
    const tableChecks: any = {}
    
    for (const table of tables) {
      try {
        const { error } = await supabaseAdmin
          .from(table)
          .select('*')
          .limit(1)
        
        tableChecks[table] = {
          exists: !error || !error.message.includes('does not exist'),
          error: error?.message || null,
          status: error && error.message.includes('does not exist') 
            ? '❌ Table does not exist' 
            : '✅ Table exists',
        }
        console.log(`📋 [TEST 3] Table "${table}":`, tableChecks[table])
      } catch (err: any) {
        tableChecks[table] = {
          exists: false,
          error: err.message,
          status: '❌ Error checking table',
        }
      }
    }
    
    debugInfo.tests.tables = tableChecks
  } catch (error: any) {
    debugInfo.tests.tables = {
      error: error.message,
      status: '❌ Error checking tables',
    }
    console.error('❌ [TEST 3] Error:', error.message)
  }

  // Test 4: Read Operation Test
  try {
    console.log('🧪 [TEST 4] Testing read operation...')
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error, count } = await supabaseAdmin
      .from('user')
      .select('*', { count: 'exact' })
      .limit(5)
    
    debugInfo.tests.readOperation = {
      status: error ? 'failed' : 'success',
      error: error?.message || null,
      recordCount: count || data?.length || 0,
      canRead: !error,
      message: error 
        ? `❌ Failed: ${error.message}` 
        : `✅ Successfully read ${count || data?.length || 0} records`,
      sampleData: data?.slice(0, 2) || null, // Show first 2 records
    }
    
    console.log('📊 [TEST 4] Result:', {
      status: debugInfo.tests.readOperation.status,
      recordCount: debugInfo.tests.readOperation.recordCount,
    })
  } catch (error: any) {
    debugInfo.tests.readOperation = {
      status: 'error',
      error: error.message,
      canRead: false,
      message: `❌ Error: ${error.message}`,
    }
    console.error('❌ [TEST 4] Error:', error.message)
  }

  // Summary
  const allTestsPassed = 
    debugInfo.tests.serverClient?.canConnect &&
    debugInfo.tests.adminClient?.canConnect &&
    debugInfo.tests.readOperation?.canRead

  debugInfo.summary = {
    allTestsPassed,
    status: allTestsPassed ? '✅ All tests passed!' : '⚠️ Some tests failed',
    message: allTestsPassed
      ? 'Backend is properly connected to Supabase!'
      : 'Check the individual test results above for details.',
  }

  console.log('📝 [SUMMARY]', debugInfo.summary)
  console.log('✅ [DEBUG] Debug endpoint completed')

  return NextResponse.json(debugInfo, {
    status: allTestsPassed ? 200 : 500,
  })
}

