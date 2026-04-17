import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Untyped client — type safety is enforced at the action layer
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
