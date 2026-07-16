// repositories/categoryRepository.ts
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const categoryRepository = {
  // Ensure this matches exactly what is in your database!
async create(data: { name: string }) {
  const supabase = await createSupabaseServerClient();
  // Ensure you are ONLY sending 'name'
  return await supabase.from("categories").insert({ name: data.name }).select().single();
}
};