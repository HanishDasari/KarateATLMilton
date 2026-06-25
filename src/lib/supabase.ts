import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Reads from environment variables (set in Render → Environment, and in a local .env):
//   VITE_SUPABASE_URL
//   VITE_SUPABASE_ANON_KEY
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// When the keys aren't set yet, the portal shows a "not configured" message
// instead of crashing the whole site.
export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url as string, anonKey as string)
  : null;

export type Role = 'parent' | 'teacher' | 'admin';

export interface Profile {
  id: string;
  full_name: string | null;
  role: Role;
}
