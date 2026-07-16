import { productRepository } from "@/repositories/productRepository";

export const productService = {
  async getProductsForPublic() {
    const { data, error } = await productRepository.getAllPublished();
    if (error) throw error;
    return data;
  },

  async addProduct(productData: any, userId: string) {
    // Business logic: Ensure the user is allowed to perform this action
    // or format data before sending to repo
    return await productRepository.create({ ...productData, created_by: userId });
  }
};