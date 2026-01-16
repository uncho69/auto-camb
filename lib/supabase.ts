import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client con service role per operazioni admin (solo server-side)
if (!supabaseServiceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is missing! Database operations will fail.')
}

export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceRoleKey || supabaseAnonKey, // Fallback ad anon key se service role manca
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

