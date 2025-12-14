import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { corsHeaders } from '@/lib/cors'
import { generateEmbeddingsBatch } from '@/lib/ai/embeddings'

// Handle OPTIONS (preflight) requests
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}

// POST /api/messages/backfill - Add embeddings to existing messages that don't have them
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { batchSize = 10, limit } = body

    const supabaseAdmin = getSupabaseAdmin()

    // Get messages without embeddings
    let query = supabaseAdmin
      .from('messages')
      .select('id, content, embedding')
      .is('embedding', null)
      .order('created_at', { ascending: true })

    if (limit) {
      query = query.limit(limit)
    }

    const { data: messages, error: fetchError } = await query

    if (fetchError) {
      return NextResponse.json(
        { message: 'Error fetching messages', error: fetchError.message },
        { status: 500, headers: corsHeaders }
      )
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        {
          message: 'No messages found without embeddings',
          processed: 0,
          total: 0,
        },
        { headers: corsHeaders }
      )
    }

    // Filter out messages with empty content
    const messagesToProcess = messages.filter(
      (msg) => msg.content && msg.content.trim().length > 0
    )

    if (messagesToProcess.length === 0) {
      return NextResponse.json(
        {
          message: 'No messages with valid content to process',
          processed: 0,
          total: messages.length,
        },
        { headers: corsHeaders }
      )
    }

    // Generate embeddings in batches
    const texts = messagesToProcess.map((msg) => msg.content)
    let embeddings: number[][]
    
    try {
      embeddings = await generateEmbeddingsBatch(texts, batchSize)
    } catch (error) {
      return NextResponse.json(
        {
          message: 'Failed to generate embeddings',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500, headers: corsHeaders }
      )
    }

    if (embeddings.length !== messagesToProcess.length) {
      return NextResponse.json(
        {
          message: 'Mismatch between messages and embeddings count',
          messagesCount: messagesToProcess.length,
          embeddingsCount: embeddings.length,
        },
        { status: 500, headers: corsHeaders }
      )
    }

    // Update messages with embeddings
    let successCount = 0
    let errorCount = 0
    const errors: string[] = []

    for (let i = 0; i < messagesToProcess.length; i++) {
      const message = messagesToProcess[i]
      const embedding = embeddings[i]

      const { error: updateError } = await supabaseAdmin
        .from('messages')
        .update({ embedding })
        .eq('id', message.id)

      if (updateError) {
        errorCount++
        errors.push(`Message ${message.id}: ${updateError.message}`)
      } else {
        successCount++
      }
    }

    return NextResponse.json(
      {
        message: 'Backfill completed',
        processed: successCount,
        errors: errorCount,
        total: messagesToProcess.length,
        errorDetails: errors.length > 0 ? errors : undefined,
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500, headers: corsHeaders }
    )
  }
}

// GET /api/messages/backfill - Get statistics about messages needing backfill
export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()

    // Count messages without embeddings
    const { count: withoutEmbeddings, error: countError } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .is('embedding', null)

    if (countError) {
      return NextResponse.json(
        { message: 'Error counting messages', error: countError.message },
        { status: 500, headers: corsHeaders }
      )
    }

    // Count total messages
    const { count: total, error: totalError } = await supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true })

    if (totalError) {
      return NextResponse.json(
        { message: 'Error counting total messages', error: totalError.message },
        { status: 500, headers: corsHeaders }
      )
    }

    return NextResponse.json(
      {
        withoutEmbeddings: withoutEmbeddings || 0,
        total: total || 0,
        withEmbeddings: (total || 0) - (withoutEmbeddings || 0),
      },
      { headers: corsHeaders }
    )
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Server error', error: error.message },
      { status: 500, headers: corsHeaders }
    )
  }
}

