import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { createServerClient } from '@/lib/supabase/server'

// GET /api/test-query - Test query with detailed logging
export async function GET() {
  const results: any = {
    timestamp: new Date().toISOString(),
    tests: {},
  }

  // Test 1: Admin client query
  try {
    console.log('🧪 [TEST QUERY] Testing with admin client...')
    const supabaseAdmin = getSupabaseAdmin()
    
    const { data, error, count } = await supabaseAdmin
      .from('user')
      .select('*', { count: 'exact' })
    
    results.tests.adminClient = {
      success: !error,
      error: error?.message || null,
      errorCode: error?.code || null,
      dataLength: data?.length || 0,
      count: count || 0,
      sampleData: data?.slice(0, 2) || null,
      message: error 
        ? `❌ Failed: ${error.message} (code: ${error.code})`
        : `✅ Success: Found ${count || data?.length || 0} records`,
    }
    
    console.log('📊 [TEST QUERY] Admin client result:', results.tests.adminClient)
  } catch (error: any) {
    results.tests.adminClient = {
      success: false,
      error: error.message,
      message: `❌ Error: ${error.message}`,
    }
    console.error('❌ [TEST QUERY] Admin client error:', error)
  }

  // Test 2: Regular client query (for comparison)
  try {
    console.log('🧪 [TEST QUERY] Testing with regular client...')
    const supabase = createServerClient()
    
    const { data, error, count } = await supabase
      .from('user')
      .select('*', { count: 'exact' })
    
    results.tests.regularClient = {
      success: !error,
      error: error?.message || null,
      errorCode: error?.code || null,
      dataLength: data?.length || 0,
      count: count || 0,
      sampleData: data?.slice(0, 2) || null,
      message: error 
        ? `❌ Failed: ${error.message} (code: ${error.code})`
        : `✅ Success: Found ${count || data?.length || 0} records`,
    }
    
    console.log('📊 [TEST QUERY] Regular client result:', results.tests.regularClient)
  } catch (error: any) {
    results.tests.regularClient = {
      success: false,
      error: error.message,
      message: `❌ Error: ${error.message}`,
    }
    console.error('❌ [TEST QUERY] Regular client error:', error)
  }

  // Test 3: Direct SQL-like query test
  try {
    console.log('🧪 [TEST QUERY] Testing with select count...')
    const supabaseAdmin = getSupabaseAdmin()
    
    const { count, error } = await supabaseAdmin
      .from('user')
      .select('*', { count: 'exact', head: true })
    
    results.tests.countQuery = {
      success: !error,
      error: error?.message || null,
      errorCode: error?.code || null,
      count: count || 0,
      message: error 
        ? `❌ Failed: ${error.message}`
        : `✅ Count: ${count} records`,
    }
    
    console.log('📊 [TEST QUERY] Count query result:', results.tests.countQuery)
  } catch (error: any) {
    results.tests.countQuery = {
      success: false,
      error: error.message,
      message: `❌ Error: ${error.message}`,
    }
  }

  return NextResponse.json(results)
}

