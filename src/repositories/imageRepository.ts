
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { createClient } from "@supabase/supabase-js";

const STORAGE_BUCKET = "products";

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
  async listFolders(): Promise<string[]> {
    const { data: files, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list();

    if (error) {
      console.error("[ImageRepository] List folders error:", error);
      throw error;
    }

    const folders = files
      .filter((f) => f.id === null)
      .map((f) => f.name);

    return folders;
  },

  async listImagesByFolder(folderName: string): Promise<ImageMetadata[]> {
    const { data: files, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list(folderName);

    if (error) {
      console.error(`[ImageRepository] List images error for folder ${folderName}:`, error);
      return [];
    }

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

  getPublicUrl(filePath: string): string {
    return supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath).data.publicUrl;
  },

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

  async deleteImage(filePath: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("[ImageRepository] Delete error:", error);
      throw error;
    }
  },

  async createFolder(folderName: string): Promise<void> {
    const { error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(`${folderName}/.keep`, new Blob([""], { type: "text/plain" }));

    if (error) {
      console.error("[ImageRepository] Create folder error:", error);
      throw error;
    }
  },

  async deleteFolder(folderName: string): Promise<void> {
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .list(folderName);

    if (listError) {
      console.error("[ImageRepository] List folder error:", listError);
      throw listError;
    }

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