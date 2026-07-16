// lib/imageUtils.ts
import imageCompression from "browser-image-compression";

export const processAndCompressImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.15,        // Aggressive compression target
    maxWidthOrHeight: 800,  // Standard web gallery size
    useWebWorker: true,
    fileType: 'image/webp', // Force WebP for maximum efficiency
  };

  const compressedBlob = await imageCompression(file, options);
  
  // Convert to file with .webp extension
  const cleanName = file.name.split('.').slice(0, -1).join('.') + '.webp';
  return new File([compressedBlob], cleanName, { type: 'image/webp' });
};