import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';

let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side: Always create a new instance
    return createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Client-side: Use singleton pattern
  if (!supabaseInstance) {
    supabaseInstance = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          persistSession: true,
          storageKey: 'supabase.auth.token',
          storage: window.localStorage,
        },
      }
    );
  }

  return supabaseInstance;
}

// Reset instance (useful for testing or when you need to force a new instance)
export function resetSupabaseClient() {
  supabaseInstance = null;
} 