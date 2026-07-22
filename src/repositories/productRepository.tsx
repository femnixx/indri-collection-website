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
  },

  async getAllCategoriesWithProducts() {
    const supabase = await createSupabaseServerClient();
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("id, name, created_at")
      .order("created_at", { ascending: true });

    if (catError) throw catError;
    if (!categories || categories.length === 0) return [];

    const { data: allProducts, error: prodError } = await supabase
      .from("products")
      .select("id, category_id, name, description, image_url, is_published, created_at, updated_at");

    if (prodError) throw prodError;

    const productsByCategory = (allProducts || []).reduce((acc: Record<string, any[]>, product) => {
      const catId = product.category_id;
      if (!acc[catId]) acc[catId] = [];
      acc[catId].push(product);
      return acc;
    }, {});

    const storage = supabase.storage.from("products");

    const enriched = await Promise.all(
      categories.map(async (cat) => {
        const rawProducts = productsByCategory[cat.id] || [];
        const products = await Promise.all(
          rawProducts.map(async (product) => {
            let imageUrl = product.image_url;
            if (!imageUrl) {
              const folder = cat.name.replace(/\s+/g, "_").toLowerCase();
              const { data: files } = await storage.list(folder);
              const productFile = files?.find((f) => f.name !== ".keep");
              if (productFile) {
                imageUrl = storage.getPublicUrl(`${folder}/${productFile.name}`).data.publicUrl;
              }
            }
            return { ...product, image_url: imageUrl };
          })
        );
        return { ...cat, products };
      })
    );

    return enriched;
  }
};
