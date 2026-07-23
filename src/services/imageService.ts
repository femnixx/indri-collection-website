// src/services/imageService.ts
// Image Service - Business logic for image operations

import { imageRepository, ImageMetadata } from "@/repositories/imageRepository";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { AppError } from "@/lib/errors";

export const imageService = {
  /**
   * Fetch all categories (folders) with their images
   */
  async getAllCategoriesWithImages(): Promise<
    { name: string; images: ImageMetadata[] }[]
  > {
    const folders = await imageRepository.listFolders();
    
    const categoriesWithImages = await Promise.all(
      folders.map(async (folder) => ({
        name: folder,
        images: await imageRepository.listImagesByFolder(folder),
      }))
    );

    return categoriesWithImages;
  },

  /**
   * Fetch images for a specific category
   */
  async getImagesByCategory(categoryName: string): Promise<ImageMetadata[]> {
    return imageRepository.listImagesByFolder(categoryName);
  },

  /**
   * Upload an image to a category folder
   * Requires admin authentication
   */
  async uploadImage(
    folder: string,
    file: File,
    userId: string
  ): Promise<{ path: string; publicUrl: string }> {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      throw AppError.badRequest("File must be an image");
    }

    // Validate file size (5MB max)
    const maxSize = parseInt(process.env.MAX_FILE_SIZE_BYTES || "5242880");
    if (file.size > maxSize) {
      throw AppError.badRequest(
        `File size must be less than ${maxSize / 1024 / 1024}MB`
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const fileExt = file.name.split(".").pop() || "webp";
    const fileName = `${timestamp}_${randomId}.${fileExt}`;

    return imageRepository.uploadImage(folder, file, fileName);
  },

  /**
   * Delete an image
   * Requires admin authentication
   */
  async deleteImage(filePath: string, userId: string): Promise<void> {
    return imageRepository.deleteImage(filePath);
  },

  /**
   * Create a new category folder
   * Requires admin authentication
   */
  async createCategory(name: string, userId: string): Promise<void> {
    // Sanitize folder name
    const sanitizedName = name.trim().toLowerCase().replace(/\s+/g, "_");
    
    if (!sanitizedName || sanitizedName.length < 1) {
      throw AppError.badRequest("Category name is required");
    }

    return imageRepository.createFolder(sanitizedName);
  },

  /**
   * Delete a category folder and all its images
   * Requires admin authentication
   */
  async deleteCategory(name: string, userId: string): Promise<void> {
    return imageRepository.deleteFolder(name);
  },
};