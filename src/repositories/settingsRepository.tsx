import { supabaseAuth } from "@/lib/supabaseClient";

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

const BASE_API_URL = '/api/admin/settings';

export const settingsRepository = {
 async fetchPublicSettings(): Promise<ShopSettingsData> {
  try {
    const { data: { session } } = await supabaseAuth.auth.getSession();
    
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (session) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(BASE_API_URL, { method: 'GET', headers });
    if (!response.ok) throw new Error(`HTTP status ${response.status}`);
    
    const json = await response.json();
    return json.success && json.data ? { ...FALLBACK_SETTINGS, ...json.data } : FALLBACK_SETTINGS;
  } catch (error) {
    return FALLBACK_SETTINGS;
  }
},

async saveSettings(data: ShopSettingsData): Promise<ShopSettingsData> {
  const { data: { session } } = await supabaseAuth.auth.getSession();
  if (!session) throw new RepositoryError("Unauthorized", 401);

  const response = await fetch(BASE_API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}` 
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Gagal menyimpan data.");
    throw new RepositoryError(errorText, response.status);
  }

  const json = await response.json();
  return json.data;
}
};