import { createSupabaseAdminClient } from "@/lib/supabaseServer";

export const categoryRepository = {
  // Create a new category in the database and ensure its storage folder exists
  async create(data: { name: string }) {
    const supabase = createSupabaseAdminClient();
    const result = await supabase
      .from("categories")
      .insert({ name: data.name })
      .select()
      .single();

    const folderName = data.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
    const keepPath = `${folderName}/.keep`;
    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(keepPath, new Blob([""], { type: "application/octet-stream" }), {
        contentType: "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      console.error("[STORAGE] .keep upload error:", uploadError);
    }

    return result;
  },

  // Rename a category folder in Supabase Storage and database
  async rename(oldName: string, newName: string) {
    const supabase = createSupabaseAdminClient();
    const oldFolder = oldName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');
    const newFolder = newName.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');

    if (oldFolder === newFolder) {
      // Just update DB if slug didn't change
      const { error } = await supabase
        .from("categories")
        .update({ name: newName })
        .eq("name", oldName);
      if (error) throw error;
      return;
    }

    // 1. Get category ID and affected products BEFORE updating the category name
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("name", oldName)
      .single();

    // 2. List ALL files in old folder (including .keep)
    const { data: files, error: listError } = await supabase.storage
      .from("products")
      .list(oldFolder);

    if (listError) {
      console.error("[STORAGE] List error:", listError);
    }

    // 3. Move EVERY file (including .keep) to newFolder
    if (files && files.length > 0) {
      for (const file of files) {
        const oldPath = `${oldFolder}/${file.name}`;
        const newPath = `${newFolder}/${file.name}`;

        // Copy file to new path
        const { error: copyError } = await supabase.storage
          .from("products")
          .copy(oldPath, newPath);

        if (copyError) {
          console.error(`[STORAGE] Copy error for ${oldPath}:`, copyError);
        } else {
          // Remove from old path once copy succeeds
          await supabase.storage.from("products").remove([oldPath]);
        }
      }
    } else {
      // If old folder was empty, create .keep in new folder
      await supabase.storage
        .from("products")
        .upload(`${newFolder}/.keep`, new Blob([""]), { upsert: true });
    }

    // 4. Update category name in Database
    const { error: updateError } = await supabase
      .from("categories")
      .update({ name: newName })
      .eq("name", oldName);

    if (updateError) throw updateError;

    // 5. Update product image_urls in Database
    if (category?.id) {
      const { data: products } = await supabase
        .from("products")
        .select("id, image_url")
        .eq("category_id", category.id);

      if (products) {
        for (const prod of products) {
          if (!prod.image_url) continue;
          const updatedUrl = prod.image_url.replace(`/products/${oldFolder}/`, `/products/${newFolder}/`);
          if (updatedUrl !== prod.image_url) {
            await supabase
              .from("products")
              .update({ image_url: updatedUrl })
              .eq("id", prod.id);
          }
        }
      }
    }
  },

  async delete(id: number | string, name: string) {
    const supabase = createSupabaseAdminClient();
    const folderName = name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');

    // 1. Delete ALL files in folder from Supabase Storage (including .keep)
    const { data: files } = await supabase.storage
      .from("products")
      .list(folderName);

    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${folderName}/${f.name}`);
      await supabase.storage.from("products").remove(filePaths);
    }

    // 2. Delete products belonging to this category from DB
    await supabase.from("products").delete().eq("category_id", id);

    // 3. Delete category record
    return await supabase.from("categories").delete().eq("id", id);
  }
};