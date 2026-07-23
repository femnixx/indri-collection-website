import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { productRepository } from "@/repositories/productRepository";

export const productService = {
  async getAllCategoriesWithProducts() {
    return productRepository.getAllCategoriesWithProducts();
  },

  async addProduct(
    productData: { name: string; description?: string; category_id: string | number; is_published: boolean }, 
    userId: string, 
    file: File | null, 
    categoryId: string | number
  ) {
    const supabaseAdmin = createSupabaseAdminClient();
    
    // 1. Fetch category
    const { data: category, error: catError } = await supabaseAdmin
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();

    if (catError || !category) throw new Error("Kategori tidak ditemukan.");

    // 2. Handle File Upload
    if (!file) throw new Error("File is required.");
    
    const folderName = category.name.replace(/\s+/g, '_').toLowerCase();
    const filePath = `${folderName}/${Date.now()}_${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;

    const { error: uploadError } = await supabaseAdmin.storage
        .from('products')
        .upload(filePath, file, { contentType: 'image/webp', upsert: true });

    if (uploadError) throw uploadError;

    // 3. Save to DB
    try {
      return await productRepository.create({ 
        name: productData.name,
        description: productData.description || "",
        category_id: categoryId.toString(),
        is_published: productData.is_published,
        image_url: filePath,  // ✅ Store the file path, not full URL
        created_by: userId
      });
    } catch (dbError) {
      await supabaseAdmin.storage.from('products').remove([filePath]);
      throw dbError; 
    }
  },

  // ✅ NEW: Convert file paths to public URLs
  async resolveImageUrl(filePath: string | null): Promise<string> {
    if (!filePath) return "/placeholder.png";

    const supabaseAdmin = createSupabaseAdminClient();
    const { data } = supabaseAdmin.storage
      .from("products")
      .getPublicUrl(filePath);  // ✅ Returns public URL (never expires)

    return data.publicUrl;
  }
};