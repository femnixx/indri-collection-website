import { supabase } from "@/lib/supabaseClient";

export const productRepository = {
  // Used by the public "Main Page"
  async getAllPublished() {
    return await supabase.from("products").select("*").eq("is_published", true).order("created_at", { ascending: false });
  },
  
  // Used by Admin Panel to show everything
  async getAll() {
    return await supabase.from("products").select("*, categories(name)");
  },

  async create(data: any) {
    return await supabase.from("products").insert(data).select().single();
  },

  async update(id: string, data: any) {
    return await supabase.from("products").update(data).eq("id", id);
  },

  async delete(id: string) {
  return await supabase
    .from("products") // Specify your table name here
    .delete()         // Then call the delete method
    .eq("id", id);    // Filter which record to delete
}
};