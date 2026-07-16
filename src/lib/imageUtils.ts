// lib/imageUtils.ts
import imageCompression from "browser-image-compression";

export const processAndCompressImage = async (file: File) => {
  const options = {
    maxSizeMB: 0.1,        // Strictly target 100KB
    maxWidthOrHeight: 800, // Keep at 800px for good visual quality
    initialQuality: 0.7,   // Start at 70% quality to help hit the target
    useWebWorker: true,
    fileType: 'image/webp',
  };

  const compressedBlob = await imageCompression(file, options);
  
  // Create a new file with .webp extension
  const cleanName = file.name.split('.').slice(0, -1).join('.') + '.webp';
  return new File([compressedBlob], cleanName, { type: 'image/webp' });
};