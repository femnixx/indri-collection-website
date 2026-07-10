// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Peringatan: Kredensial Supabase tidak ditemukan di environment variables. Pastikan .env.local sudah dikonfigurasi."
  );
}

export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");