import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabaseServer";

export const productRepository = {
  // Create a new product — uploads file to "products" bucket and inserts metadata to DB
  async create(
    data: { name: string; description?: string; category_id: string; is_published: boolean; image_url: string; created_by: string; },
    file: File | null,
    categoryName: string
  ) {
    const supabaseAdmin = createSupabaseAdminClient();

    let imageUrl = data.image_url;
    if (file) {
      const folderName = categoryName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const sanitizedName = data.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().replace(/_+/g, '_');
      const fileName = sanitizedName.endsWith(`.${fileExt}`) ? sanitizedName : `${sanitizedName}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("products")
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        console.error("[STORAGE] Upload error:", uploadError);
        throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);
      }

      const url = supabaseAdmin.storage.from("products").getPublicUrl(filePath);
      imageUrl = url.data.publicUrl;
    }

    try {
      const { data: record, error } = await supabaseAdmin
        .from("products")
        .insert([{ ...data, image_url: imageUrl }])
        .select()
        .single();

      if (error) throw error;
      return record;
    } catch (dbError) {
      // Cleanup uploaded image from bucket if DB insert fails
      if (file && imageUrl) {
        const storagePath = getStoragePathFromUrl(imageUrl);
        if (storagePath) {
          await supabaseAdmin.storage.from("products").remove([storagePath]);
        }
      }
      throw dbError;
    }
  },

  // Delete product record and its image from Supabase Storage
  async delete(id: string) {
    const supabaseAdmin = createSupabaseAdminClient();

    // 1. Fetch image_url BEFORE deleting the database record
    const { data: product, error: fetchErr } = await supabaseAdmin
      .from("products")
      .select("image_url")
      .eq("id", id)
      .single();

    if (fetchErr) {
      console.error("[DB] Could not find product to delete:", fetchErr);
      throw new Error("Produk tidak ditemukan");
    }

    // 2. Delete file from Storage bucket if image_url exists
    if (product?.image_url) {
      const relativePath = getStoragePathFromUrl(product.image_url);
      
      console.log(`[STORAGE] Deleting for product ID ${id}:`);
      console.log(`[STORAGE] Full DB URL: "${product.image_url}"`);
      console.log(`[STORAGE] Target Relative Path: "${relativePath}"`);

      if (relativePath) {
        // relativePath MUST be "folder_name/filename.ext"
        const { data: removeData, error: storageErr } = await supabaseAdmin.storage
          .from("products")
          .remove([relativePath]);

        if (storageErr) {
          console.error("[STORAGE] Failed to delete image file:", storageErr);
        } else {
          console.log("[STORAGE] Successfully deleted file from bucket:", removeData);
        }
      } else {
        console.warn(`[STORAGE] Could not parse relative storage path from URL: ${product.image_url}`);
      }
    }

    // 3. Delete database record
    const { error } = await supabaseAdmin.from("products").delete().eq("id", id);
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
