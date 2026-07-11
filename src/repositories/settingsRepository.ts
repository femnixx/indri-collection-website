// src/repositories/settingsRepository.ts
import { AppError } from "@/lib/errors";

export interface ShopSettingsData {
  whatsapp_number: string;
  email: string;
  address: string;
  operational_hours: string;
  instagram_url: string;
  tiktok_url: string;
}

export const settingsRepository = {
  async fetchPublicSettings(): Promise<ShopSettingsData> {
    const response = await fetch('/api/admin/settings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      throw new Error(json.error || "Gagal mengambil konfigurasi toko.");
    }

    return json.data;
  }
};