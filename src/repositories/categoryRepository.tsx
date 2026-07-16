import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const categoryRepository = {
  // Create a new category in the database
  async create(data: { name: string }) {
    const supabase = await createSupabaseServerClient();
    return await supabase
      .from("categories")
      .insert({ name: data.name })
      .select()
      .single();
  },

  // Rename a category folder in storage
  async rename(oldName: string, newName: string) {
    const supabase = await createSupabaseServerClient();
    const oldFolder = oldName.replace(/\s+/g, '_').toLowerCase();
    const newFolder = newName.replace(/\s+/g, '_').toLowerCase();

    // 1. List files from the old folder
    const { data: files, error: listError } = await supabase.storage
      .from('products')
      .list(oldFolder);

    if (listError || !files) return;

    // 2. Copy files to the new folder and remove old ones
    for (const file of files) {
      // Skip the .keep file if it exists
      if (file.name === '.keep') continue;

      await supabase.storage
        .from('products')
        .copy(`${oldFolder}/${file.name}`, `${newFolder}/${file.name}`);
        
      await supabase.storage
        .from('products')
        .remove([`${oldFolder}/${file.name}`]);
    }

    // 3. Optional: Remove the old folder's .keep file if you used one
    await supabase.storage.from('products').remove([`${oldFolder}/.keep`]);
  },

  async delete(id: number, name: string) {
    const supabase = await createSupabaseServerClient();
    const folderName = name.replace(/\s+/g, '_').toLowerCase();

    // 1. List and remove all files in the folder
    const { data: files } = await supabase.storage.from('products').list(folderName);
    
    if (files && files.length > 0) {
      await supabase.storage
        .from('products')
        .remove(files.map(f => `${folderName}/${f.name}`));
    }

    // 2. Delete the database record
    return await supabase.from("categories").delete().eq("id", id);
  }
};