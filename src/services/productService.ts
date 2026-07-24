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

    // 1. Fetch category to get its name (used for the storage bucket folder)
    const { data: category, error: catError } = await supabaseAdmin
      .from("categories")
      .select("name")
      .eq("id", categoryId)
      .single();

    if (catError || !category) throw new Error("Kategori tidak ditemukan.");

    // Normalize category slug for storage path
    const categorySlug = category.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');

    // 2. Save file to the Supabase Storage bucket "products" inside a category folder
    // AND insert the product record into the database "products" table
    return await productRepository.create({
      name: productData.name,
      description: productData.description || "",
      category_id: categoryId.toString(),
      is_published: productData.is_published,
      image_url: "",
      created_by: userId
    }, file, categorySlug);
  },

  /**
   * Rename a product — updates the database "products" table AND renames
   * the image file inside the category folder in the Supabase Storage bucket.
   */
  async renameProduct(id: string, newName: string) {
    const supabaseAdmin = createSupabaseAdminClient();

    // 1. Fetch the current product to get its image_url
    const { data: product, error: fetchError } = await supabaseAdmin
      .from("products")
      .select("image_url, name, category_id")
      .eq("id", id)
      .single();

    if (fetchError || !product) throw new Error("Produk tidak ditemukan.");

    let newImageUrl = product.image_url;

    // 2. Fetch category name to determine folder
    const { data: category, error: catError } = await supabaseAdmin
      .from("categories")
      .select("name")
      .eq("id", product.category_id)
      .single();

    if (catError || !category) throw new Error("Kategori tidak ditemukan.");

    const folderName = category.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');

    if (product.image_url) {
      // Derive old file name from the current image_url path
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

    // 3. Update both name and image_url in the database
    const { error } = await supabaseAdmin
      .from("products")
      .update({ name: newName, image_url: newImageUrl })
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  },
};
