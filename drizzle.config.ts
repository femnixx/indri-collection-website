import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  // Path menuju berkas skema tempat Anda menaruh pgTable sebelumnya
  schema: './src/validations/settingsSchema.ts', 
  
  // Folder tujuan tempat berkas migrasi SQL akan dibuat
  out: './drizzle',            
  
  dialect: 'postgresql',
  dbCredentials: {
    // Ambil string koneksi dari environment variable Supabase Anda
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!, 
  },
});