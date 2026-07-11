// src/services/settingsService.ts
import { SupabaseClient } from "@supabase/supabase-js";
import { ContactSettingsInput } from "@/validations/settingsSchema";
import { AppError } from "@/lib/errors";

export const settingsService = { 
    async getSettings(supabase: SupabaseClient) {
        const { data, error } = await supabase
            .from("shop_settings")
            .select("whatsapp_number, email, address, operational_hours, instagram_url, tiktok_url")
            .eq("id", 1)
            .maybeSingle();

        if (error) { 
            console.error("[DB ERROR][getSettings]: ", error.message);
            // Lempar error internal 500 terstandarisasi
            throw AppError.internal();
        }
        return data;
    },

    async updateSettings(supabase: SupabaseClient, validatedData: ContactSettingsInput) { 
        // 🔥 PERBAIKAN: Gunakan .upsert untuk memperbarui/memasukkan data
        const { data, error } = await supabase
            .from("shop_settings")
            .upsert({ id: 1, ...validatedData }) // Menyuntikkan data yang sudah divalidasi aman oleh Zod
            .select("whatsapp_number, email, address, operational_hours, instagram_url, tiktok_url")
            .single();

        if (error) { 
            console.error("[DB ERROR][updateSettings]: ", error.message);
            throw AppError.internal();
        }
        return data;
    }
}