// The one place that decides "local demo" or "Supabase". Both values are public by design:
// the anon key is safe in the browser ONLY because Row Level Security protects the data
// (see supabase/migrations). Never put a service_role key in any VITE_ variable.
import { createClient } from '@supabase/supabase-js'

const url = (import.meta.env.VITE_SUPABASE_URL ?? '').trim()
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY ?? '').trim()

export const HAS_BACKEND = Boolean(url && anonKey)
export const IMAGE_BUCKET = 'dress-images'

export const supabase = HAS_BACKEND
  ? createClient(url, anonKey, { auth: { persistSession: true, autoRefreshToken: true } })
  : null

/** Turns a Supabase/Postgres error into a message an owner can read. */
export function explain(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback
  if (error.code === '23505') return 'Another dress already uses this code.'
  if (error.code === '23P01') return 'Some of those dates are already taken. Make them available first.'
  if (error.code === '42501') return 'You do not have permission to do that. Sign in again as the owner.'
  if (error.message?.includes('Failed to fetch')) return 'Could not reach the server. Check your internet connection.'
  return error.message || fallback
}
