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

    // Optionally create a .keep file so the folder is visible in the Supabase Storage dashboard
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

    // 1. Update category name in database
    const { error: updateError } = await supabase
      .from("categories")
      .update({ name: newName })
      .eq("name", oldName);

    if (updateError) throw updateError;

    // 2. List files in old folder, move each to new folder, and update product image URLs
    const { data: files, error: listError } = await supabase.storage
      .from("products")
      .list(oldFolder);

    if (listError) throw listError;

    for (const file of files || []) {
      // Skip .keep files
      if (file.name === ".keep") continue;

      const oldPath = `${oldFolder}/${file.name}`;
      const newPath = `${newFolder}/${file.name}`;

      // Copy file to new path
      const { error: copyError } = await supabase.storage
        .from("products")
        .copy(oldPath, newPath);

      if (copyError) {
        console.error("[STORAGE] Copy error:", copyError);
        throw copyError;
      }

      // Remove old file
      const { error: removeError } = await supabase.storage
        .from("products")
        .remove([oldPath]);

      if (removeError) {
        console.error("[STORAGE] Remove error:", removeError);
        throw removeError;
      }
    }
  },

  async delete(id: number, name: string) {
    const supabase = createSupabaseAdminClient();
    const folderName = name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '');

    // 1. Delete the folder and all its contents from Supabase Storage
    const { data: files, error: listError } = await supabase.storage
      .from("products")
      .list(folderName);

    if (listError) {
      console.error("[STORAGE] List error:", listError);
    }

    if (files && files.length > 0) {
      const filePaths = files
        .filter((f) => f.name !== ".keep")
        .map((f) => `${folderName}/${f.name}`);

      if (filePaths.length > 0) {
        const { error: removeError } = await supabase.storage
          .from("products")
          .remove(filePaths);

        if (removeError) {
          console.error("[STORAGE] Remove error:", removeError);
          throw removeError;
        }
      }
    }

    // 2. Delete products belonging to this category from database
    await supabase.from("products").delete().eq("category_id", id);

    // 3. Delete the category record
    return await supabase.from("categories").delete().eq("id", id);
  }
};
