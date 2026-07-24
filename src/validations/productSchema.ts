// schemas/productSchema.ts
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nama produk terlalu pendek").max(100),
  description: z.string().max(1000).optional(),
  category_id: z.string().uuid("Kategori tidak valid"),
  image_url: z.string().url("URL gambar tidak valid"),
  is_published: z.boolean().default(false),
});

export type ProductInput = z.infer<typeof productSchema>;