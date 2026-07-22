import { createClient } from '@supabase/supabase-js';

// Ambil variabel environment bawaan dari .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Peringatan: NEXT_PUBLIC_SUPABASE_URL atau NEXT_PUBLIC_SUPABASE_ANON_KEY belum terpasang di .env.local Anda."
  );
}

// Gunakan variabel yang sama untuk kedua client agar kode halaman kelola koleksi tidak error/patah
const validUrl = supabaseUrl || "https://placeholder-project.supabase.co";
const validKey = supabaseAnonKey || "placeholder-key";

export const supabaseAuth = createClient(validUrl, validKey);
export const supabaseData = createClient(validUrl, validKey);