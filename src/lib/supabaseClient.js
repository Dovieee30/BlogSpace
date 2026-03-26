import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if the URL looks like a valid Supabase URL
function isValidUrl(url) {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

export const isConfigured = isValidUrl(supabaseUrl) && Boolean(supabaseAnonKey)

// Only create the real client if properly configured
export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-anon-key')

if (import.meta.env.DEV && !isConfigured) {
  console.warn(
    '[BlogSpace] Supabase not configured. Edit .env with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then restart.'
  )
}
