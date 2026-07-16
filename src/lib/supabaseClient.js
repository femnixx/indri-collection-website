import { createBrowserClient } from '@supabase/ssr';

// Kredensial Auth 
const supabaseAuthUrl = process.env.NEXT_PUBLIC_SUPABASE_AUTH_URL;
const supabaseAuthAnonKey = process.env.NEXT_PUBLIC_SUPABASE_AUTH_ANON_KEY;

// Kredensial DB & Storage
const supabaseDataUrl = process.env.NEXT_PUBLIC_SUPABASE_DB_URL;
const supabaseDataAnonKey = process.env.NEXT_PUBLIC_SUPABASE_DB_ANON_KEY;

if (!supabaseAuthUrl || !supabaseDataUrl) {
  console.warn(
    "Peringatan: Kredensial Supabase tidak lengkap di environment variables. Pastikan .env.local sudah dikonfigurasi dengan benar."
  );
}

export const supabaseAuth = createClient(supabaseAuthUrl || "", supabaseAuthAnonKey || "");
export const supabaseData = createClient(supabaseDataUrl || "", supabaseDataAnonKey || "");
