import { createClient } from '@supabase/supabase-js'

// Get Supabase URL and anonymous key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create a single supabase client for interacting with the database
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Ensures user is anonymously authenticated
 * Creates a new anonymous session if one doesn't exist
 */
export const ensureAnonymousAuth = async () => {
  const { data } = await supabase.auth.getSession()

  // If no session exists, sign in anonymously
  if (!data.session) {
    await supabase.auth.signInAnonymously()
  }

  return supabase.auth.getSession()
}

/**
 * Gets the current user ID or null if not authenticated
 */
export const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession()
  return data.session?.user?.id || null
}
