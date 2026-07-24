"use client";

import React from "react";
import { Mail, MessageSquare, Clock, Save, MapPin, Music2, MessageCircleMore } from "lucide-react";
import { SettingsFormData } from "../hooks/useSettings";

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

interface FieldProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  hint?: string;
}

function FormField({ label, icon, children, hint }: FieldProps) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-dark tracking-wide block">{label}</label>
      <div className="relative rounded-xl shadow-xs">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          {icon}
        </div>
        {children}
      </div>
      {hint && <span className="text-[10px] text-slate-muted block font-light pl-1">{hint}</span>}
    </div>
  );
}

const inputCls =
  "block w-full pl-10 pr-4 py-3 border border-slate-light rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors font-medium text-primary bg-white";

interface SettingsFormProps {
  formData: SettingsFormData;
  isSaving: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SettingsForm({ formData, isSaving, onChange, onSubmit }: SettingsFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
      <h3 className="text-sm font-bold text-slate-dark uppercase tracking-wider border-b border-slate-light pb-3">
        Tautan Media Sosial & Kontak
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormField label="Email Indri Collection" icon={<Mail className="h-4 w-4 text-slate-muted" />}>
          <input
            type="email"
            name="email_address"
            value={formData.email_address}
            onChange={onChange}
            className={inputCls}
            placeholder="contoh@gmail.com"
            required
          />
        </FormField>

        <FormField label="Tautan Profile Instagram" icon={<InstagramIcon className="h-4 w-4 text-slate-muted" />}>
          <input
            type="text"
            name="instagram_url"
            value={formData.instagram_url}
            onChange={onChange}
            className={inputCls}
            placeholder="https://instagram.com/username"
            required
          />
        </FormField>

        <FormField
          label="Tautan Profile TikTok"
          icon={<Music2 className="h-4 w-4 text-slate-muted" />}
        >
          <input
            type="text"
            name="tiktok_url"
            value={formData.tiktok_url}
            onChange={onChange}
            className={inputCls}
            placeholder="https://tiktok.com/@username"
            required
          />
        </FormField>

        <FormField
          label="Nomor WhatsApp (Akses Chat Langsung)"
          icon={<MessageCircleMore className="h-4 w-4 text-slate-muted" />}
          hint='Gunakan kode negara di awal tanpa tanda "+" (misal: 628123...).'
        >
          <input
            type="text"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={onChange}
            className="block w-full pl-10 pr-4 py-3 border border-slate-light rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-accent/10 focus:border-accent transition-colors font-medium text-primary bg-white"
            placeholder="628xxxxxxxxxx"
            required
          />
        </FormField>
      </div>

      <h3 className="text-sm font-bold text-slate-dark uppercase tracking-wider border-b border-slate-light pb-3 pt-4">
        Informasi Tambahan
      </h3>

      <FormField label="Alamat Lengkap Toko" icon={<MapPin className="h-4 w-4 text-slate-muted" />}>
        <textarea
          name="address"
          value={formData.address}
          onChange={onChange}
          rows={3}
          className="block w-full pl-10 pr-4 py-3 border border-slate-light rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors font-medium text-primary bg-white resize-none"
          placeholder="Masukkan alamat lengkap toko minimum 10 karakter..."
          required
        />
      </FormField>

      <FormField label="Jam Operasional Toko" icon={<Clock className="h-4 w-4 text-slate-muted" />}>
        <input
          type="text"
          name="operational_hours"
          value={formData.operational_hours}
          onChange={onChange}
          className={inputCls}
          placeholder="Senin – Sabtu: 09:00 – 16:00 WIB"
          required
        />
      </FormField>

      <div className="flex items-center justify-end pt-4 border-t border-slate-light">
        <button
          type="submit"
          disabled={isSaving}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-accent text-white font-bold text-sm shadow-md shadow-accent/15 hover:bg-highlight transition-all cursor-pointer ${
            isSaving ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Menyimpan
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
  );
}
