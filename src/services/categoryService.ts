import { categoryRepository } from "@/repositories/categoryRepository";
import { CategoryInput } from "@/validations/categorySchema";

export const categoryService = {
  /**
   * Add a new category
   */
  async addCategory(data: CategoryInput) {
    try {
      if (!data.name || data.name.trim().length === 0) {
        throw new Error("Nama kategori tidak boleh kosong.");
      }

      const category = await categoryRepository.create({ 
        name: data.name.trim()
      });
      
      if (!category) {
        throw new Error("Gagal membuat kategori.");
      }

      return category;
    } catch (error: any) {
      console.error("[SERVICE ERROR] Add category:", error.message);
      throw error;
    }
  },

  /**
   * Rename an existing category
   * Note: Auth check already done in route handler
   */
  async renameCategory(oldName: string, newName: string, userId: string) {
    try {
      if (!oldName?.trim() || !newName?.trim()) {
        throw new Error("Nama lama dan baru wajib diisi.");
      }

      console.log(`[SERVICE] User ${userId} renaming category: "${oldName}" → "${newName}"`);
      
      await categoryRepository.rename(oldName, newName);
      
      return { success: true };
    } catch (error: any) {
      console.error("[SERVICE ERROR] Rename category:", error.message);
      throw error;
    }
  },

  /**
   * Delete a category
   * Note: Auth check already done in route handler
   */
  async deleteCategory(id: number, name: string, userId: string) {
    try {
      if (!id || !name?.trim()) {
        throw new Error("ID dan nama kategori diperlukan.");
      }

      console.log(`[SERVICE] User ${userId} deleting category: "${name}" (ID: ${id})`);
      
      await categoryRepository.delete(id, name);
      
      return { success: true };
    } catch (error: any) {
      console.error("[SERVICE ERROR] Delete category:", error.message);
      throw error;
    }
  }
};