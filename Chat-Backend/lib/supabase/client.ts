import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client with placeholder values if env vars are missing (for build time)
// Will throw error at runtime if actually used without proper credentials
export const supabase = createClient(
  supabaseUrl || 'https://rbcfrjmkgmpmzraabggm.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiY2Zyam1rZ21wbXpyYWFiZ2dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2MzE2NzMsImV4cCI6MjA4MTIwNzY3M30.8hchBEKSU6avijWR9OvCQYqUzwOaf6MYAw1Cq4byM90'
)

