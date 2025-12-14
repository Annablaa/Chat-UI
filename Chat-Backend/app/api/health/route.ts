import { NextResponse } from 'next/server'
import { corsHeaders } from '@/lib/cors'

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders })
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Backend is running',
    timestamp: new Date().toISOString()
  }, { headers: corsHeaders })
}

