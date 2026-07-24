import { createSupabaseAdminClient } from "@/lib/supabaseServer";
import { productRepository } from "@/repositories/productRepository";

export const productService = {
  async addProduct(
    productData: { name: string; description?: string; category_id: string | number; is_published: boolean },
    userId: string,
    file: File | null,
    categoryId: string | number
  ) {
    const supabaseAdmin = createSupabaseAdminClient();

    const { data: category, error: catError } = await supabaseAdmin
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();

    if (catError || !category) throw new Error("Kategori tidak ditemukan.");

    const categorySlug = category.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');

    return await productRepository.create({
      name: productData.name,
      description: productData.description || "",
      category_id: categoryId.toString(),
      is_published: productData.is_published,
      image_url: "",
      created_by: userId
    }, file, categorySlug);
  },

  async renameProduct(id: string, newName: string) {
    const supabaseAdmin = createSupabaseAdminClient();

    const { data: product, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("image_url, name, category_id")
      .eq("id", id)
      .single();

    if (fetchError || !product) throw new Error("Produk tidak ditemukan.");

    let newImageUrl = product.image_url;

    const { data: category, error: catError } = await supabaseAdmin
      .from("categories")
      .select("name")
      .eq("id", product.category_id)
      .single();

    if (catError || !category) throw new Error("Kategori tidak ditemukan.");

    const folderName = category.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');

    if (product.image_url) {
      const publicBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/products/`;
      const oldFileName = product.image_url.replace(publicBase, "").replace(`${folderName}/`, "");

      const fileExt = oldFileName.split(".").pop() || "webp";
      const sanitized = newName.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase().replace(/_+/g, "_");
      const newFileName = `${sanitized}.${fileExt}`;
      const newPath = `${folderName}/${newFileName}`;

      if (oldFileName !== newFileName) {
        const { error: copyError } = await supabaseAdmin.storage
          .from("products")
          .copy(`${folderName}/${oldFileName}`, newPath);

        if (copyError) throw copyError;

        const { error: removeError } = await supabaseAdmin.storage
          .from("products")
          .remove([`${folderName}/${oldFileName}`]);

        if (removeError) throw removeError;
      }

      const publicUrl = supabaseAdmin.storage.from("products").getPublicUrl(newPath);
      newImageUrl = publicUrl.data.publicUrl;
    }

    const { error } = await supabaseAdmin
      .from("products")
      .update({ name: newName, image_url: newImageUrl })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  },

  // Added this wrapper so the API route can call it through productService
  async getAllCategoriesWithProducts() {
    return await productRepository.getAllCategoriesWithProducts();
  }
};