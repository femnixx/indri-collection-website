import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabaseServer";

function getStoragePathFromUrl(publicUrl: string): string | null {
  if (!publicUrl) return null;
  const parts = publicUrl.split("/storage/v1/object/public/products/");
  return parts[1] || null;
}

export const productRepository = {
  // Create a new product — uploads the file to the Supabase Storage bucket "products"
  // inside a category folder AND inserts the product metadata into the database.
  async create(
    data: { name: string; description?: string; category_id: string; is_published: boolean; image_url: string; created_by: string; },
    file: File | null,
    categoryName: string
  ) {
    const supabaseAdmin = createSupabaseAdminClient();

    // 1. Upload the file to the Supabase Storage bucket "products"
    // inside a category folder: products/{categoryName}/{productName}.{ext}
    let imageUrl = data.image_url;
    if (file) {
      // Normalize folder and file names to safe slugs
      const folderName = categoryName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'webp';
      const sanitizedName = data.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().replace(/_+/g, '_');
      const fileName = sanitizedName.endsWith(`.${fileExt}`) ? sanitizedName : `${sanitizedName}.${fileExt}`;
      const filePath = `${folderName}/${fileName}`;

      // Upload file to Supabase Storage
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

      // Public URL of the uploaded file
      const url = supabaseAdmin.storage.from("products").getPublicUrl(filePath);
      imageUrl = url.data.publicUrl;
    }

    // 2. Save to the database "products" table
    try {
      const { data: record, error } = await supabaseAdmin
        .from("products")
        .insert([{ ...data, image_url: imageUrl }])
        .select()
        .single();
      if (error) throw error;
      return record;
    } catch (dbError) {
      // Clean up the uploaded file from Supabase Storage if the database insert fails
      if (file && imageUrl) {
        const path = new URL(imageUrl).pathname;
        const storagePath = path.replace(/^\/storage\/v1\/object\/public\/products\//, "");
        if (storagePath.startsWith("products/")) {
          await supabaseAdmin.storage.from("products").remove([storagePath]);
        }
      }
      throw dbError;
    }
  },

  async delete(id: string) {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: product } = await supabaseAdmin.from("products").select("image_url").eq("id", id).single();

    if (product?.image_url) {
      // Remove file from Supabase Storage using relative path
      const relativePath = getStoragePathFromUrl(product.image_url);
      if (relativePath) {
        const { error: storageErr } = await supabaseAdmin.storage
          .from("products")
          .remove([relativePath]);
        if (storageErr) {
          console.error("Failed to delete storage file:", storageErr);
        }
      }
    }

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

    // image_url is already a visitable URL stored in the database — no Supabase storage needed
    const enriched = categories.map((cat) => {
      const rawProducts = productsByCategory[cat.id] || [];
      return { ...cat, products: rawProducts };
    });

    return enriched;
  }
};
