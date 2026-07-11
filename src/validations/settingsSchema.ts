import z from "zod";

export const contactSettingsSchema = z.object({
    whatsapp_number: z
        .string()
        .min(10, "Nomor WA terlalu pendek")
        .max(15, "Nomor WA terlalu panjang")
        .regex(/^62d+$/, "Format harus diawali dengan kode negara 62 tanpa anda spasi atau tanda +"),
    email: z
        .string()
        .min(1, "Email wajib diisi")
        .email("Format email resmi tidak valid")
        .trim(),
    address: z
        .string()
        .min(10, "Alamat terlalu pendek")
        .max(500, "Alamat maksimal 500 karakter")
        .trim(),
    operational_hours: z
        .string()
        .min(5, "Jam operasional terlalu pendek")
        .max(100, "Jam operasional maksimal 100 karakter")
        .trim(),
    instagram_url: z
        .string()
        .url("Tautan instagram tidak valid")
        .regex(/^https:\/\/(www\.)?instagram\.com\/.+$/, "Harus merupakan URL Instagram resmi")
        .optional()
        .or(z.literal("")),
    facebook_url: z
        .string()
        .url("Tautan Facebook tidak valid")
        .regex(/^https:\/\/(www\.)?facebook\.com\/.+$/, "Harus merupakan URL Facebook resmi")
        .optional()
        .or(z.literal("")),
    tiktok_url: z
        .string()
        .url("Tautan Tiktok tidak valid")
        .regex(/^https:\/\/(www\.)?tiktok\.com\/.+$/, "Harus merupakan URL Tiktok resmi")
    .or(z.literal("")),    
});

export type ContactSettingsInput = z.infer<typeof contactSettingsSchema>;