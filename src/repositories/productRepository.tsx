import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const productRepository = {
  async getAllPublished() {
    const supabase = await createSupabaseServerClient();
    return await supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
  },

  async getAll() {
    const supabase = await createSupabaseServerClient();
    return await supabase
      .from("products")
      .select("*, categories(name)");
  },

  async create(data: {
    name: string;
    description?: string;
    category_id: string;
    is_published: boolean;
    image_url: string;
    created_by: string;
  }) {
    const supabase = await createSupabaseServerClient();
    const { data: record, error } = await supabase
      .from("products")
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error("[Repository] Create Product Error:", error);
      throw error;
    }
    return record;
  },

  async update(id: string, data: Partial<{
    name: string;
    description: string;
    category_id: string;
    is_published: boolean;
    image_url: string;
  }>) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("products")
      .update(data)
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  },

  async delete(id: string) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  }
};