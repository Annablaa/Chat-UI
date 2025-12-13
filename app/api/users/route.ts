import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { CreateUserDto, UpdateUserDto } from '@/lib/types/entities'

// GET /api/users - Get all users or filter by query params
export async function GET(request: Request) {
  console.log('📥 [USERS API] GET request received')
  try {
    console.log('🔌 [USERS API] Creating admin client (bypasses RLS)...')
    // Use admin client to bypass RLS for backend operations
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const role = searchParams.get('role')
    
    console.log('🔍 [USERS API] Query parameters:', { id, role })

    if (id) {
      // Get single user by ID
      console.log(`🔍 [USERS API] Fetching user with ID: ${id}`)
      const { data, error } = await supabase
        .from('user')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('❌ [USERS API] Error fetching user:', error.message)
        return NextResponse.json(
          { message: 'User not found', error: error.message },
          { status: 404 }
        )
      }

      console.log('✅ [USERS API] User found:', { id: data?.id, name: data?.name })
      return NextResponse.json({ data })
    }

    // Get all users or filter by role
    let query = supabase.from('user').select('*')

    if (role) {
      query = query.eq('role', role)
    }

    console.log('📊 [USERS API] Executing query...')
    const { data, error, count } = await query.order('id', { ascending: true })

    if (error) {
      console.error('❌ [USERS API] Query error:', error.message)
      console.error('🔍 [USERS API] Error code:', error.code)
      console.error('🔍 [USERS API] Error details:', error)
      return NextResponse.json(
        { message: 'Error fetching users', error: error.message, errorCode: error.code },
        { status: 500 }
      )
    }

    console.log(`✅ [USERS API] Query executed successfully`)
    console.log(`📊 [USERS API] Data received:`, { 
      dataLength: data?.length || 0, 
      count: count || data?.length || 0,
      hasData: !!data && data.length > 0,
      firstRecord: data?.[0] || null
    })
    
    return NextResponse.json({ 
      data: data || [], 
      count: count || data?.length || 0,
      debug: {
        queryExecuted: true,
        dataReceived: !!data,
        dataLength: data?.length || 0
      }
    })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/users - Create a new user
export async function POST(request: Request) {
  console.log('📥 [USERS API] POST request received')
  try {
    let body: CreateUserDto
    
    try {
      body = await request.json()
      console.log('📋 [USERS API] Request body received:', { 
        name: body.name, 
        role: body.role, 
        hasDescription: !!body.description 
      })
    } catch (error) {
      console.error('❌ [USERS API] Invalid JSON:', error)
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    // Validate required fields
    if (!body.name || !body.role) {
      console.warn('⚠️ [USERS API] Missing required fields')
      return NextResponse.json(
        { message: 'Missing required fields: name and role are required' },
        { status: 400 }
      )
    }

    // Validate field types
    if (typeof body.name !== 'string' || typeof body.role !== 'string') {
      console.warn('⚠️ [USERS API] Invalid field types')
      return NextResponse.json(
        { message: 'Invalid field types: name and role must be strings' },
        { status: 400 }
      )
    }

    // Generate unique UUID for the user
    const userId = crypto.randomUUID()
    console.log('🆔 [USERS API] Generated user ID:', userId)

    // Use admin client to bypass RLS for backend operations
    console.log('🔌 [USERS API] Creating admin client...')
    const supabaseAdmin = getSupabaseAdmin()
    console.log('💾 [USERS API] Inserting user into database...')
    const { data, error } = await supabaseAdmin
      .from('user')
      .insert([
        {
          id: userId,
          name: body.name,
          role: body.role,
          description: body.description || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error('❌ [USERS API] Error creating user:', error.message)
      console.error('🔍 [USERS API] Error details:', error)
      return NextResponse.json(
        { message: 'Error creating user', error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ [USERS API] User created successfully:', { 
      id: data?.id, 
      name: data?.name 
    })
    return NextResponse.json(
      { message: 'User created successfully', data },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/users - Update a user (requires id in body)
export async function PUT(request: Request) {
  try {
    const supabase = createServerClient()
    let body: UpdateUserDto & { id: string | number }
    
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { message: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    if (!body.id) {
      return NextResponse.json(
        { message: 'User id is required' },
        { status: 400 }
      )
    }

    const updateData: UpdateUserDto = {}
    if (body.name !== undefined) {
      if (typeof body.name !== 'string') {
        return NextResponse.json(
          { message: 'Invalid field type: name must be a string' },
          { status: 400 }
        )
      }
      updateData.name = body.name
    }
    if (body.role !== undefined) {
      if (typeof body.role !== 'string') {
        return NextResponse.json(
          { message: 'Invalid field type: role must be a string' },
          { status: 400 }
        )
      }
      updateData.role = body.role
    }
    if (body.description !== undefined) {
      updateData.description = body.description
    }

    // Check if there are any fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No fields to update. Provide at least one field: name, role, or description' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS for backend operations
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('user')
      .update(updateData)
      .eq('id', body.id)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { message: 'Error updating user', error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'User updated successfully', data },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/users?id=xxx - Delete a user
export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'User id is required as query parameter' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS for backend operations
    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin
      .from('user')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        { message: 'Error deleting user', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

