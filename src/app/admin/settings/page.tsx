"use client";

import React, { useState } from "react";
import { Mail, MessageSquare, Clock, Save, CheckCircle2 } from "lucide-react";


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
  const [formData, setFormData] = useState({
    email: "indricollection@gmail.com",
    instagram: "@indricollection.mlg",
    tiktok: "@indricollection07",
    whatsapp: "6281234567890", // Standard international format fallback for WA links
    operationalHours: "Senin – Sabtu: 09:00 – 16:00 WIB",
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Mimicking DB/Supabase patch request latency
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccessToast(true);

      // Auto-hide success message after 3 seconds
      setTimeout(() => setShowSuccessToast(false), 3000);
    }, 800);
  };

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
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-medium text-gray-800"
                placeholder="contoh@gmail.com"
                required
              />
            </div>
          </div>

          {/* Instagram Username */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 tracking-wide block">
              Username Instagram
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <InstagramIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-medium text-gray-800"
                placeholder="@username"
                required
              />
            </div>
          </div>

          {/* TikTok Username */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 tracking-wide block">
              Username TikTok
            </label>
            <div className="relative rounded-xl shadow-xs">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 font-bold text-xs">
                🎦
              </div>
              <input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-colors font-medium text-gray-800"
                placeholder="@username"
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
                name="whatsapp"
                value={formData.whatsapp}
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
              name="operationalHours"
              value={formData.operationalHours}
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