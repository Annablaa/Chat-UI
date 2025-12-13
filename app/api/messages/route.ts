import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { CreateMessageDto, UpdateMessageDto } from '@/lib/types/entities'

// GET /api/messages - Get all messages or filter by query params
export async function GET(request: Request) {
  try {
    // Use admin client to bypass RLS for backend operations
    const supabase = getSupabaseAdmin()
    const { searchParams } = new URL(request.url)
    const id_message = searchParams.get('id_message')
    const id_chatnumb = searchParams.get('id_chatnumb')
    const id_user = searchParams.get('id_user')

    if (id_message) {
      // Get single message by ID
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('id_message', id_message)
        .single()

      if (error) {
        return NextResponse.json(
          { message: 'Message not found', error: error.message },
          { status: 404 }
        )
      }

      return NextResponse.json({ data })
    }

    // Get messages with optional filters
    let query = supabase.from('messages').select('*')

    if (id_chatnumb) {
      query = query.eq('id_chatnumb', id_chatnumb)
    }

    if (id_user) {
      query = query.eq('id_user', id_user)
    }

    const { data, error } = await query.order('message_date', { ascending: false })

    if (error) {
      return NextResponse.json(
        { message: 'Error fetching messages', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, count: data?.length || 0 })
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/messages - Create a new message
export async function POST(request: Request) {
  try {
    const supabase = createServerClient()
    const body: CreateMessageDto = await request.json()

    // Validate required fields
    if (!body.id_chatnumb || !body.id_user || !body.content) {
      return NextResponse.json(
        { message: 'Missing required fields: id_chatnumb, id_user, and content are required' },
        { status: 400 }
      )
    }

    // Generate unique UUID for the message
    const messageId = crypto.randomUUID()
    console.log('🆔 [MESSAGES API] Generated message ID:', messageId)

    const messageData = {
      id_message: messageId,
      id_chatnumb: body.id_chatnumb,
      id_user: body.id_user,
      content: body.content,
      message_date: body.message_date || new Date().toISOString(),
      is_edited: body.is_edited || false,
    }

    // Use admin client to bypass RLS for backend operations
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('messages')
      .insert([messageData])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { message: 'Error creating message', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Message created successfully', data },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

// PUT /api/messages - Update a message (requires id_message in body)
export async function PUT(request: Request) {
  try {
    const supabase = createServerClient()
    const body: UpdateMessageDto & { id_message: string | number } = await request.json()

    if (!body.id_message) {
      return NextResponse.json(
        { message: 'Message id_message is required' },
        { status: 400 }
      )
    }

    const updateData: UpdateMessageDto = {}
    if (body.id_chatnumb !== undefined) updateData.id_chatnumb = body.id_chatnumb
    if (body.id_user !== undefined) updateData.id_user = body.id_user
    if (body.content !== undefined) updateData.content = body.content
    if (body.message_date !== undefined) updateData.message_date = body.message_date
    if (body.is_edited !== undefined) updateData.is_edited = body.is_edited

    // If content is being updated, set is_edited to true
    if (body.content !== undefined && updateData.is_edited === undefined) {
      updateData.is_edited = true
    }

    // Use admin client to bypass RLS for backend operations
    const supabaseAdmin = getSupabaseAdmin()
    const { data, error } = await supabaseAdmin
      .from('messages')
      .update(updateData)
      .eq('id_message', body.id_message)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { message: 'Error updating message', error: error.message },
        { status: 500 }
      )
    }

    if (!data) {
      return NextResponse.json(
        { message: 'Message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Message updated successfully', data },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/messages?id_message=xxx - Delete a message
export async function DELETE(request: Request) {
  try {
    const supabase = createServerClient()
    const { searchParams } = new URL(request.url)
    const id_message = searchParams.get('id_message')

    if (!id_message) {
      return NextResponse.json(
        { message: 'Message id_message is required as query parameter' },
        { status: 400 }
      )
    }

    // Use admin client to bypass RLS for backend operations
    const supabaseAdmin = getSupabaseAdmin()
    const { error } = await supabaseAdmin
      .from('messages')
      .delete()
      .eq('id_message', id_message)

    if (error) {
      return NextResponse.json(
        { message: 'Error deleting message', error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Message deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500 }
    )
  }
}

