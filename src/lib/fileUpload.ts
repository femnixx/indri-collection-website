// src/lib/fileUpload.ts
// File-based image storage utility — saves images to the public/ directory
// so they are accessible via visitable URLs (e.g. /images/products/folder/file.webp)

import fs from "fs";
import path from "path";

const UPLOAD_DIR = path.join(process.cwd(), "public", "images", "products");

/**
 * Ensure a folder exists under public/images/products/
 * Returns the absolute path to the folder.
 */
export function ensureUploadDir(folder: string): string {
  const dir = path.join(UPLOAD_DIR, folder);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
}

/**
 * Save a file buffer to the public directory and return its visitable URL.
 */
export function saveFile(
  folder: string,
  buffer: Buffer,
  filename: string
): string {
  const dir = ensureUploadDir(folder);
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return `/images/products/${folder}/${filename}`;
}

/**
 * Delete a single image file by its visitable URL.
 */
export function deleteFile(imageUrl: string): void {
  if (!imageUrl || !imageUrl.startsWith("/images/products/")) return;
  const filePath = path.join(process.cwd(), "public", imageUrl);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}

/**
 * Delete an entire folder and all its contents.
 */
export function deleteFolder(folder: string): void {
  const dir = path.join(UPLOAD_DIR, folder);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Rename (move) a folder to a new name.
 */
export function renameFolder(oldName: string, newName: string): void {
  const oldDir = path.join(UPLOAD_DIR, oldName);
  const newDir = path.join(UPLOAD_DIR, newName);
  if (fs.existsSync(oldDir)) {
    fs.renameSync(oldDir, newDir);
  }
}

/**
 * Rename a file inside a category folder and return the new visitable URL.
 * The new filename is derived from the provided product name (sanitized)
 * while preserving the original file extension.
 */
export function renameFile(imageUrl: string, newName: string): string {
  if (!imageUrl || !imageUrl.startsWith("/images/products/")) return imageUrl;

  const relativePath = imageUrl.replace("/images/products/", "");
  const parts = relativePath.split("/");
  if (parts.length < 2) return imageUrl;

  const folder = parts[0];
  const oldFilename = parts.slice(1).join("/");
  const ext = oldFilename.split(".").pop();

  const sanitized = newName.replace(/\s+/g, "_").toLowerCase();
  const newFilename = `${sanitized}.${ext}`;

  const oldPath = path.join(UPLOAD_DIR, folder, oldFilename);
  const newPath = path.join(UPLOAD_DIR, folder, newFilename);

  if (fs.existsSync(oldPath) && oldFilename !== newFilename) {
    fs.renameSync(oldPath, newPath);
  }

  return `/images/products/${folder}/${newFilename}`;
}

/**
 * List image files (excluding .keep) in a folder, returning visitable URLs.
 */
export function listFiles(folder: string): { name: string; url: string }[] {
  const dir = path.join(UPLOAD_DIR, folder);
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((name) => name !== ".keep")
    .map((name) => ({
      name,
      url: `/images/products/${folder}/${name}`,
    }));
}

/**
 * List all sub-folders (categories) under public/images/products/.
 */
export function listFolders(): string[] {
  if (!fs.existsSync(UPLOAD_DIR)) return [];

  return fs
    .readdirSync(UPLOAD_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}
