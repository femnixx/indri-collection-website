// validations/categorySchema.ts
import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(3, "Nama kategori minimal 3 karakter").max(50),
  // Removed slug from here
});

export type CategoryInput = z.infer<typeof categorySchema>;