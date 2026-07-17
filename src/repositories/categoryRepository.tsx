import { createSupabaseAdminClient } from "@/lib/supabaseServer";

export const categoryRepository = {
  /**
   * Create a new category in the database
   */
  async create(data: { name: string }) {
    if (!data.name || data.name.trim().length === 0) {
      throw new Error("Nama kategori tidak boleh kosong.");
    }

    const supabaseAdmin = createSupabaseAdminClient();
    
    try {
      const { data: category, error } = await supabaseAdmin
        .from("categories")
        .insert({ name: data.name.trim() })
        .select()
        .single();

      if (error) {
        console.error("[DB ERROR] Create category:", error.message);
        throw new Error("Gagal membuat kategori di database.");
      }

      return category;
    } catch (error: any) {
      console.error("[REPO ERROR] Create category:", error.message);
      throw error;
    }
  },

  /**
   * Rename a category: updates DB and moves storage folder
   */
  async rename(oldName: string, newName: string) {
    if (!oldName?.trim() || !newName?.trim()) {
      throw new Error("Nama lama dan baru wajib diisi.");
    }

    const supabaseAdmin = createSupabaseAdminClient();
    const oldFolder = oldName.trim().replace(/\s+/g, '_').toLowerCase();
    const newFolder = newName.trim().replace(/\s+/g, '_').toLowerCase();

    // Prevent renaming to same name
    if (oldFolder === newFolder) {
      throw new Error("Nama baru harus berbeda dari nama lama.");
    }

    try {
      // Step 1: Update database first
      console.log(`[RENAME] Updating DB: "${oldName}" → "${newName}"`);
      const { error: dbError } = await supabaseAdmin
        .from("categories")
        .update({ name: newName.trim() })
        .eq("name", oldName.trim());

      if (dbError) {
        console.error("[DB ERROR] Rename category:", dbError.message);
        throw new Error("Gagal memperbarui nama kategori di database.");
      }

      // Step 2: List files in old storage folder
      console.log(`[RENAME] Listing files in storage folder: ${oldFolder}`);
      const { data: files, error: listError } = await supabaseAdmin.storage
        .from('products')
        .list(oldFolder);

      if (listError) {
        console.error("[STORAGE ERROR] List files:", listError.message);
        throw new Error("Gagal membaca folder storage.");
      }

      // Step 3: Copy files to new folder and remove from old folder
      if (files && files.length > 0) {
        console.log(`[RENAME] Found ${files.length} files, copying to ${newFolder}`);
        
        for (const file of files) {
          if (file.name === '.keep') continue;

          try {
            // Copy file to new location
            const { error: copyError } = await supabaseAdmin.storage
              .from('products')
              .copy(`${oldFolder}/${file.name}`, `${newFolder}/${file.name}`);

            if (copyError) {
              console.error(`[STORAGE ERROR] Copy ${file.name}:`, copyError.message);
              continue; // Continue with other files
            }

            // Remove from old location
            const { error: removeError } = await supabaseAdmin.storage
              .from('products')
              .remove([`${oldFolder}/${file.name}`]);

            if (removeError) {
              console.error(`[STORAGE ERROR] Remove ${file.name}:`, removeError.message);
              // Don't throw, file is already copied
            }
          } catch (error: any) {
            console.error(`[FILE ERROR] Processing ${file.name}:`, error.message);
          }
        }
      }

      // Step 4: Remove .keep file from old folder
      console.log(`[RENAME] Removing .keep file from ${oldFolder}`);
      const { error: keepError } = await supabaseAdmin.storage
        .from('products')
        .remove([`${oldFolder}/.keep`]);

      if (keepError) {
        console.error("[STORAGE ERROR] Remove .keep:", keepError.message);
        // Don't throw, .keep is just a placeholder
      }

      // Step 5: Create .keep file in new folder
      console.log(`[RENAME] Creating .keep file in ${newFolder}`);
      const { error: createKeepError } = await supabaseAdmin.storage
        .from('products')
        .upload(`${newFolder}/.keep`, new Blob([''], { type: 'text/plain' }), { upsert: true });

      if (createKeepError) {
        console.error("[STORAGE ERROR] Create .keep:", createKeepError.message);
        throw new Error("Gagal membuat folder storage baru.");
      }

      console.log(`[RENAME] Successfully renamed "${oldName}" to "${newName}"`);
      return { success: true };
    } catch (error: any) {
      console.error("[REPO ERROR] Rename category:", error.message);
      throw error;
    }
  },

 async delete(id: number, name: string) {
  if (!id || !name?.trim()) {
    throw new Error("ID dan nama kategori diperlukan.");
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const folderName = name.trim().replace(/\s+/g, '_').toLowerCase();

  try {
    // Step 1: Delete all products in this category from database first
    console.log(`[DELETE] Removing products with category_id ${id}`);
    const { error: productsError } = await supabaseAdmin
      .from("products")
      .delete()
      .eq("category_id", id);

    if (productsError) {
      console.error("[DB ERROR] Delete products:", productsError.message);
      throw new Error("Gagal menghapus produk dari database.");
    }

    // Step 2: List all files in storage folder
    console.log(`[DELETE] Listing files in ${folderName}`);
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('products')
      .list(folderName);

    if (listError) {
      console.error("[STORAGE ERROR] List files:", listError.message);
      throw new Error("Gagal membaca folder storage.");
    }

    // Step 3: Delete all files from storage
    if (files && files.length > 0) {
      const fileNames = files.map(f => `${folderName}/${f.name}`);
      console.log(`[DELETE] Removing ${fileNames.length} files from storage`);
      
      const { error: removeError } = await supabaseAdmin.storage
        .from('products')
        .remove(fileNames);

      if (removeError) {
        console.error("[STORAGE ERROR] Remove files:", removeError.message);
        throw new Error("Gagal menghapus file dari storage.");
      }
    }

    // Step 4: Delete the category from database
    console.log(`[DELETE] Deleting category ID ${id} from database`);
    const { error: dbError } = await supabaseAdmin
      .from("categories")
      .delete()
      .eq("id", id);

    if (dbError) {
      console.error("[DB ERROR] Delete category:", dbError.message);
      throw new Error("Gagal menghapus kategori dari database.");
    }

    console.log(`[DELETE] Successfully deleted category "${name}" (ID: ${id}) with all products and images`);
    return { success: true };
  } catch (error: any) {
    console.error("[REPO ERROR] Delete category:", error.message);
    throw error;
  }
}
};