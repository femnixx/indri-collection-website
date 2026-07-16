import { productRepository } from "@/repositories/productRepository";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const productService = {
  async addProduct(
    productData: { 
      name: string; 
      description?: string; 
      category_id: string; 
      is_published: boolean 
    }, 
    userId: string, 
    file: File | null, 
    categoryId: string 
  ) {
    const supabase = await createSupabaseServerClient();
    
    // 1. Fetch category name to use as folder path
    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();

    if (catError || !category) {
      throw new Error("Kategori tidak ditemukan.");
    }

    const folderName = category.name.replace(/\s+/g, '_').toLowerCase();
    let imageUrl = "";

    // 2. Handle File Upload
    if (file) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`; // Uses category name as folder

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('products').getPublicUrl(filePath);
      imageUrl = data.publicUrl;
    }

    // 3. Save to DB
    return await productRepository.create({ 
      name: productData.name,
      description: productData.description || "",
      category_id: categoryId, // Keep ID for database relationship
      is_published: productData.is_published,
      image_url: imageUrl,
      created_by: userId
    });
  }
};