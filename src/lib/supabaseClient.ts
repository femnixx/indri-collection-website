// src/lib/supabaseClient.ts
// Supabase Client - Browser client for client-side operations

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials not found in .env.local");
}

// Create a singleton browser client
export const supabaseAuth = createBrowserClient(
  supabaseUrl || "https://placeholder-project.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// For data operations, we use the same client
export const supabaseData = supabaseAuth;