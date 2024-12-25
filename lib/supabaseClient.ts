// lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Extend the NodeJS.Global interface correctly
declare global {
  // eslint-disable-next-line no-var
  var supabase: SupabaseClient | undefined;
}

// Check if there's already a Supabase client instance; if not, create one
const supabase = global.supabase || createClient(supabaseUrl, supabaseAnonKey);

// Ensure the client is created only once in a server environment
if (typeof window === 'undefined') global.supabase = supabase;

export { supabase };
