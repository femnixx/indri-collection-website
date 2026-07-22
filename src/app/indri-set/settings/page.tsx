"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, MessageSquare, Clock, Save, CheckCircle2, AlertCircle, MapPin } from "lucide-react";
import { settingsRepository, FALLBACK_SETTINGS } from "@/repositories/settingsRepository";

const InstagramIcon = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function AdminSettingsPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email_address: FALLBACK_SETTINGS.email_address,
    instagram_url: FALLBACK_SETTINGS.instagram_url,
    tiktok_url: FALLBACK_SETTINGS.tiktok_url,
    whatsapp_number: FALLBACK_SETTINGS.whatsapp_number, 
    operational_hours: FALLBACK_SETTINGS.operational_hours,
    address: FALLBACK_SETTINGS.address, 
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 🔄 Memuat data dari database, otomatis aman menggunakan fallback jika request gagal
  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await settingsRepository.fetchPublicSettings();
        setFormData({
          email_address: data.email_address,
          instagram_url: data.instagram_url,
          tiktok_url: data.tiktok_url,
          whatsapp_number: data.whatsapp_number,
          address: data.address || FALLBACK_SETTINGS.address,
          operational_hours: data.operational_hours,
        });
      } catch (err) {
        console.error("Gagal memuat pengaturan, memakai fallback default", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Handler serbaguna untuk input text maupun textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🚀 Submit data ke API Route Handler via Repository
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await settingsRepository.saveSettings(formData);
      setShowSuccessToast(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setShowSuccessToast(false), 3000);
    } catch (err: any) {
      console.error(err);

      // 🚨 Deteksi error 401 Unauthorized dari Repository kustom
      if (err.status === 401 || err.message === "Unauthorized") {
        setErrorMessage("Sesi Anda telah berakhir atau Anda belum login. Mengalihkan ke halaman login...");
        
        // Beri jeda 2 detik agar admin dapat membaca pesan error sebelum dipindahkan
        setTimeout(() => {
          router.replace("/indri-set/login");
        }, 2000);
        return;
      }
      
      try {
        // Mencoba mengurai error object bawaan Zod schema server
        const parsedErrors = JSON.parse(err.message);
        const firstErrorKey = Object.keys(parsedErrors)[0];
        setErrorMessage(`${firstErrorKey}: ${parsedErrors[firstErrorKey][0]}`);
      } catch {
        setErrorMessage(err.message || "Gagal menyimpan perubahan ke database.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm text-gray-500 font-medium">Memuat data pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* 🌟 Header Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          Pengaturan Panel & Kontak
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 font-light">
          Kelola informasi operasional dan tautan media sosial yang terintegrasi di section <span className="font-semibold text-blue-600">"Hubungi Kami"</span> landing page.
        </p>
      </div>

      {/* 🎉 Success Notification Banner */}
      {showSuccessToast && (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl shadow-xs animate-fade-in">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-semibold">
            Perubahan berhasil disimpan! Data kontak di landing page telah diperbarui.
          </div>
        </div>
      )}

      {/* ⚠️ Error Notification Banner */}
      {errorMessage && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl shadow-xs animate-fade-in">
          <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
          <div className="text-sm font-semibold">{errorMessage}</div>
        </div>
      )}

      {/* 📝 Config Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-3">
          Tautan Media Sosial & Kontak
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 tracking-wide block">
              Email Indri Collection
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="email"
                name="email_address"
                value={formData.email_address}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-medium text-gray-800"
                placeholder="contoh@gmail.com"
                required
              />
            </div>
          </div>

          {/* Instagram URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 tracking-wide block">
              Tautan Profile Instagram
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <InstagramIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="instagram_url"
                value={formData.instagram_url}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-medium text-gray-800"
                placeholder="https://instagram.com/username"
                required
              />
            </div>
          </div>

          {/* TikTok URL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 tracking-wide block">
              Tautan Profile TikTok
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                🎦
              </div>
              <input
                type="text"
                name="tiktok_url"
                value={formData.tiktok_url}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-medium text-gray-800"
                placeholder="https://tiktok.com/@username"
                required
              />
            </div>
          </div>

          {/* WhatsApp Direct Line */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 tracking-wide block">
              Nomor WhatsApp (Akses Chat Langsung)
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <MessageSquare className="h-4 w-4 text-emerald-500" />
              </div>
              <input
                type="text"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-600 transition-colors font-medium text-gray-800"
                placeholder="628xxxxxxxxxx"
                required
              />
            </div>
            <span className="text-[10px] text-gray-400 block font-light pl-1">
              Gunakan kode negara di awal tanpa tanda "+" (misal: 628123...).
            </span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 pb-3 pt-4">
          Informasi Tambahan
        </h3>

        {/* 📍 Alamat Toko Input (Baru Ditambahkan) */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 tracking-wide block">
            Alamat Lengkap Toko
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute top-3.5 left-3.5 flex items-center pointer-events-none">
              <MapPin className="h-4 w-4 text-gray-400" />
            </div>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-medium text-gray-800 resize-none"
              placeholder="Masukkan alamat lengkap toko minimum 10 karakter..."
              required
            />
          </div>
        </div>

        {/* Jam Operasional Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 tracking-wide block">
            Jam Operasional Toko
          </label>
          <div className="relative rounded-xl shadow-xs">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Clock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              name="operational_hours"
              value={formData.operational_hours}
              onChange={handleInputChange}
              className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-medium text-gray-800"
              placeholder="Senin – Sabtu: 09:00 – 16:00 WIB"
              required
            />
          </div>
        </div>

        {/* Form CTA Submission Drawer */}
        <div className="flex items-center justify-end pt-4 border-t border-gray-50">
          <button
            type="submit"
            disabled={isSaving}
            className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-md shadow-blue-600/10 hover:bg-blue-700 transition-all cursor-pointer ${isSaving ? "opacity-70 cursor-not-allowed" : ""
              }`}
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}