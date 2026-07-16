import { categoryRepository } from "@/repositories/categoryRepository";
import { CategoryInput } from "@/validations/categorySchema";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

export const categoryService = {
  async addCategory(data: CategoryInput) {
    const { data: category, error } = await categoryRepository.create({ 
      name: data.name 
    });
    
    if (error) throw error;
    return category;
  },

  async renameCategory(oldName: string, newName: string) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Re-validate Admin access at the service level
    const userRole = user?.app_metadata?.role || user?.user_metadata?.role;
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Anda tidak memiliki akses admin.");
    }

    // Call the repository to perform the storage copy/move
    await categoryRepository.rename(oldName, newName);
  },

  async deleteCategory(id: number, name: string) {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Re-validate Admin access at the service level
    const userRole = user?.app_metadata?.role || user?.user_metadata?.role;
    if (userRole !== "admin") {
      throw new Error("Unauthorized: Anda tidak memiliki akses admin.");
    }

    // Call the repository to perform the storage and database cleanup
    await categoryRepository.delete(id, name);
  }
};