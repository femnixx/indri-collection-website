import { SupabaseClient } from "@supabase/supabase-js";
import { ContactSettingsInput } from "@/validations/settingsSchema";
import { AppError } from "@/lib/errors"; 

export const settingsService = { 
  async getSettings(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("contact_info")
      .select("whatsapp_number, email_address, address, operational_hours, instagram_url, tiktok_url")
      .limit(1)
      .maybeSingle();

    if (error) { 
      console.error("[DB ERROR][getSettings]: ", error.message);
      throw AppError.internal();
    }
    return data;
  },

  // ✅ CHANGED: Accept userId parameter instead of fetching it
  async updateSettings(supabase: SupabaseClient, validatedData: ContactSettingsInput, userId: string) { 
    // Skip auth check — already verified in route handler

    // 1. Cek apakah sudah ada data existing untuk mendapatkan ID-nya
    const { data: existing, error: fetchError } = await supabase
      .from("contact_info")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("[DB ERROR][updateSettings - Fetch Existing]: ", fetchError.message);
      throw AppError.internal();
    }
    
    // 2. Susun payload dengan properti 'address' lowercase
    const dbPayload: Record<string, any> = {
      whatsapp_number: validatedData.whatsapp_number,
      email_address: validatedData.email_address,
      address: validatedData.address,
      operational_hours: validatedData.operational_hours,
      instagram_url: validatedData.instagram_url,
      tiktok_url: validatedData.tiktok_url,
      updated_by: userId, // ✅ Use the passed userId
      updated_at: new Date().toISOString()
    };

    if (existing?.id) {
      dbPayload.id = existing.id;
    }

    // 3. Eksekusi Upsert
    const { data, error } = await supabase
      .from("contact_info")
      .upsert(dbPayload) 
      .select("whatsapp_number, email_address, address, operational_hours, instagram_url, tiktok_url")
      .limit(1)
      .maybeSingle();

    if (error) { 
      console.error("[DB ERROR][updateSettings - Upsert Failed]: ", error.message);
      throw AppError.internal();
    }

    return data;
  }
};