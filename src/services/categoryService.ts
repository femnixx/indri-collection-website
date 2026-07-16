// services/categoryService.ts
import { categoryRepository } from "@/repositories/categoryRepository";
import { CategoryInput } from "@/validations/categorySchema";

export const categoryService = {
  async addCategory(data: CategoryInput) {
    // We no longer generate or pass a slug
    const { data: category, error } = await categoryRepository.create({ 
      name: data.name 
    });
    
    if (error) throw error;
    return category;
  }
};