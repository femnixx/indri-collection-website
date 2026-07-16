import { supabase } from "@/lib/supabaseClient";

export const productRepository = {
  // Used by the public "Main Page"
  async getAllPublished() {
    return await supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
  },
  
  // Used by Admin Panel to show everything
  async getAll() {
    return await supabase
      .from("products")
      .select("*, categories(name)");
  },

  /**
   * Create a new product.
   * @param data - Object containing name, description, category_id, is_published, image_url, and created_by
   */
  async create(data: {
    name: string;
    description?: string;
    category_id: string;
    is_published: boolean;
    image_url: string;
    created_by: string;
  }) {
    return await supabase
      .from("products")
      .insert([data])
      .select()
      .single();
  },

  async update(id: string, data: Partial<{
    name: string;
    description: string;
    category_id: string;
    is_published: boolean;
    image_url: string;
  }>) {
    return await supabase
      .from("products")
      .update(data)
      .eq("id", id);
  },

  async delete(id: string) {
    return await supabase
      .from("products")
      .delete()
      .eq("id", id);
  }
};