import { createSupabaseAdminClient } from "@/lib/supabaseServer";

export const categoryRepository = {
  // Create a new category in the database
  async create(data: { name: string }) {
    // Gunakan Admin Client untuk bypass RLS pada INSERT
    const supabaseAdmin = createSupabaseAdminClient();
    return await supabaseAdmin
      .from("categories")
      .insert({ name: data.name })
      .select()
      .single();
  },

  // Rename a category folder in storage
  async rename(oldName: string, newName: string) {
    const supabaseAdmin = createSupabaseAdminClient();
    const oldFolder = oldName.replace(/\s+/g, '_').toLowerCase();
    const newFolder = newName.replace(/\s+/g, '_').toLowerCase();

    // 1. List files
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('products')
      .list(oldFolder);

    if (listError || !files) return;

    // 2. Copy & Remove files
    for (const file of files) {
      if (file.name === '.keep') continue;

      await supabaseAdmin.storage
        .from('products')
        .copy(`${oldFolder}/${file.name}`, `${newFolder}/${file.name}`);
        
      await supabaseAdmin.storage
        .from('products')
        .remove([`${oldFolder}/${file.name}`]);
    }

    // 3. Remove .keep files
    await supabaseAdmin.storage.from('products').remove([`${oldFolder}/.keep`]);
    
    // 4. Update Database record (tambahan: pastikan nama di DB juga terupdate)
    await supabaseAdmin
      .from("categories")
      .update({ name: newName })
      .eq("name", oldName);
  },

  async delete(id: number, name: string) {
    const supabaseAdmin = createSupabaseAdminClient();
    const folderName = name.replace(/\s+/g, '_').toLowerCase();

    // 1. Remove all files in storage
    const { data: files } = await supabaseAdmin.storage.from('products').list(folderName);
    
    if (files && files.length > 0) {
      await supabaseAdmin.storage
        .from('products')
        .remove(files.map(f => `${folderName}/${f.name}`));
    }

    // 2. Delete the database record
    return await supabaseAdmin.from("categories").delete().eq("id", id);
  }
};