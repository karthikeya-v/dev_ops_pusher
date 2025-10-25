import { createClient } from './supabase-client'

// Export a singleton instance for client-side use
// This uses @supabase/ssr which properly handles cookies for SSR
export const supabase = createClient()
