import { createSupabaseAdminClient } from "@/lib/supabaseServer";

export const productRepository = {
  async create(data: { name: string; description?: string; category_id: string; is_published: boolean; image_url: string; created_by: string; }) {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: record, error } = await supabaseAdmin
      .from("products")
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return record;
  },

  async delete(id: string) {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: product } = await supabaseAdmin.from("products").select("image_url").eq("id", id).single();
    
    if (product?.image_url) {
      await supabaseAdmin.storage.from("products").remove([product.image_url]);
    }

    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  }
};