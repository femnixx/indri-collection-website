export interface ShopSettingsData {
  whatsapp_number: string;
  email_address: string; 
  address: string;
  operational_hours: string;
  instagram_url: string;
  tiktok_url: string;
}

export const FALLBACK_SETTINGS: ShopSettingsData = {
  email_address: "indricollection@gmail.com",
  instagram_url: "https://instagram.com/indricollection.mlg",
  tiktok_url: "https://tiktok.com/@indricollection07",
  whatsapp_number: "6281234567890",
  address: "Jl. Veteran No. 8, Malang, Jawa Timur",
  operational_hours: "Senin – Sabtu: 09:00 – 16:00 WIB",
};

export class RepositoryError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "RepositoryError";
    this.status = status;
  }
}

export const settingsRepository = {
  async fetchPublicSettings(): Promise<ShopSettingsData> {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const json = await response.json();

      if (response.ok && json.success && json.data) {
        return {
          email_address: json.data.email_address || FALLBACK_SETTINGS.email_address,
          instagram_url: json.data.instagram_url || FALLBACK_SETTINGS.instagram_url,
          tiktok_url: json.data.tiktok_url || FALLBACK_SETTINGS.tiktok_url,
          whatsapp_number: json.data.whatsapp_number || FALLBACK_SETTINGS.whatsapp_number,
          address: json.data.address || FALLBACK_SETTINGS.address,
          operational_hours: json.data.operational_hours || FALLBACK_SETTINGS.operational_hours,
        };
      }
      return FALLBACK_SETTINGS;
    } catch (error) {
      console.warn("[REPO FALLBACK] Gagal fetch, menggunakan data default:", error);
      return FALLBACK_SETTINGS;
    }
  },

  async saveSettings(data: ShopSettingsData): Promise<ShopSettingsData> {
    const response = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const json = await response.json();

    if (!response.ok || !json.success) {
      const errorMessage = typeof json.error === 'object' 
        ? JSON.stringify(json.error) 
        : json.error || "Gagal menyimpan data.";

      throw new RepositoryError(errorMessage, response.status);
    }

    return json.data;
  }
};