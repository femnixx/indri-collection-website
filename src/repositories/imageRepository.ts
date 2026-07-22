// src/repositories/imageRepository.ts
// Image Repository - Handles all Supabase Storage operations for product images

import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { createClient } from "@supabase/supabase-js";

// Storage bucket name for product images
const STORAGE_BUCKET = "products";

// Create admin client for server-side operations with service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface ImageMetadata {
  id: string;
  name: string;
  size: number;
  mimetype: string;
  created_at: string;
  folder: string;
  image_url: string;
}

export const imageRepository = {
  /**
   * List all folders (categories) in the products storage bucket
   */
  async listFolders(): Promise<string[]> {
    const { data: files, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list();

    if (error) {
      console.error("[ImageRepository] List folders error:", error);
      throw error;
    }

    // Filter to get only folders (items with id === null)
    const folders = files
      .filter((f) => f.id === null)
      .map((f) => f.name);

    return folders;
  },

  /**
   * List all images in a specific folder/category
   */
  async listImagesByFolder(folderName: string): Promise<ImageMetadata[]> {
    const { data: files, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list(folderName);

    if (error) {
      console.error(`[ImageRepository] List images error for folder ${folderName}:`, error);
      return [];
    }

    // Filter out .keep files and map to include public URLs
    return files
      .filter((f) => f.name !== ".keep")
      .map((file) => ({
        id: file.id || `${folderName}/${file.name}`,
        name: file.name,
        size: file.metadata?.size || 0,
        mimetype: file.metadata?.mimetype || "image/webp",
        created_at: file.created_at || new Date().toISOString(),
        folder: folderName,
        image_url: supabaseAdmin.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(`${folderName}/${file.name}`).data.publicUrl,
      }));
  },

  /**
   * Get public URL for a specific image
   */
  getPublicUrl(filePath: string): string {
    return supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath).data.publicUrl;
  },

  /**
   * Upload an image to a specific folder
   */
  async uploadImage(
    folder: string,
    file: File | Blob,
    fileName: string
  ): Promise<{ path: string; publicUrl: string }> {
    const filePath = `${folder}/${fileName}`;
    
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        contentType: "image/webp",
        upsert: false,
      });

    if (error) {
      console.error("[ImageRepository] Upload error:", error);
      throw error;
    }

    const publicUrl = supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath).data.publicUrl;

    return { path: data.path, publicUrl };
  },

  /**
   * Delete an image from storage
   */
  async deleteImage(filePath: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("[ImageRepository] Delete error:", error);
      throw error;
    }
  },

  /**
   * Create a folder by uploading a .keep file
   */
  async createFolder(folderName: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(`${folderName}/.keep`, new Blob([""], { type: "text/plain" }));

    if (error) {
      console.error("[ImageRepository] Create folder error:", error);
      throw error;
    }
  },

  /**
   * Delete a folder and all its contents
   */
  async deleteFolder(folderName: string): Promise<void> {
    // First, list all files in the folder
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list(folderName);

    if (listError) {
      console.error("[ImageRepository] List folder error:", listError);
      throw listError;
    }

    // Delete all files in the folder
    if (files && files.length > 0) {
      const filePaths = files.map((f) => `${folderName}/${f.name}`);
      const { error: removeError } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .remove(filePaths);

      if (removeError) {
        console.error("[ImageRepository] Remove files error:", removeError);
        throw removeError;
      }
    }
  },
};