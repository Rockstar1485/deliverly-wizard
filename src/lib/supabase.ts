import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Temporary fallback to prevent crashes during setup
const TEMP_SUPABASE_URL = 'https://placeholder.supabase.co'
const TEMP_SUPABASE_KEY = 'placeholder-key'

export const supabase = createClient(
  supabaseUrl || TEMP_SUPABASE_URL, 
  supabaseAnonKey || TEMP_SUPABASE_KEY, 
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
)

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== TEMP_SUPABASE_URL)
}

// Auth helpers
export const getCurrentUser = () => supabase.auth.getUser()
export const getSession = () => supabase.auth.getSession()