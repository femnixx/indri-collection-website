"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { settingsRepository, FALLBACK_SETTINGS } from "@/repositories/settingsRepository";

export type SettingsFormData = {
  email_address: string;
  instagram_url: string;
  tiktok_url: string;
  whatsapp_number: string;
  operational_hours: string;
  address: string;
};

export function useSettings() {
  const router = useRouter();
  const [formData, setFormData] = useState<SettingsFormData>({
    email_address: FALLBACK_SETTINGS.email_address,
    instagram_url: FALLBACK_SETTINGS.instagram_url,
    tiktok_url: FALLBACK_SETTINGS.tiktok_url,
    whatsapp_number: FALLBACK_SETTINGS.whatsapp_number,
    operational_hours: FALLBACK_SETTINGS.operational_hours,
    address: FALLBACK_SETTINGS.address,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    settingsRepository
      .fetchPublicSettings()
      .then((data) => {
        setFormData({
          email_address: data.email_address,
          instagram_url: data.instagram_url,
          tiktok_url: data.tiktok_url,
          whatsapp_number: data.whatsapp_number,
          address: data.address || FALLBACK_SETTINGS.address,
          operational_hours: data.operational_hours,
        });
      })
      .catch((err) => console.error("Gagal memuat pengaturan, memakai fallback default", err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await settingsRepository.saveSettings(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);

      if (err.status === 401 || err.message === "Unauthorized") {
        setErrorMessage("Sesi Anda telah berakhir atau Anda belum login. Mengalihkan ke halaman login...");
        setTimeout(() => router.replace("/indri-set/login"), 2000);
        return;
      }

      try {
        const parsedErrors = JSON.parse(err.message);
        const firstKey = Object.keys(parsedErrors)[0];
        setErrorMessage(`${firstKey}: ${parsedErrors[firstKey][0]}`);
      } catch {
        setErrorMessage(err.message || "Gagal menyimpan perubahan ke database.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return { formData, isLoading, isSaving, showSuccess, errorMessage, handleChange, handleSubmit };
}
