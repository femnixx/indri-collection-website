"use client";

import { Loader2 } from "lucide-react";
import { useSettings } from "./hooks/useSettings";
import SettingsForm from "./components/SettingsForm";
import { SettingsNotice } from "./components/SettingsNotice";

export default function AdminSettingsPage() {
  const { formData, isLoading, isSaving, showSuccess, errorMessage, handleChange, handleSubmit } =
    useSettings();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center pt-20 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
        <p className="text-sm text-slate-muted font-medium">Memuat data pengaturan...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      {/* 🌟 Header Section */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
          Pengaturan Panel & Kontak
        </h1>
        <p className="mt-1.5 text-sm text-slate-muted font-light">
          Kelola informasi operasional dan tautan media sosial yang terintegrasi di section{" "}
          <span className="font-semibold text-accent">"Hubungi Kami"</span> landing page.
        </p>
      </div>

      {showSuccess && (
        <SettingsNotice
          type="success"
          message="Perubahan berhasil disimpan! Data kontak di landing page telah diperbarui."
        />
      )}

      {errorMessage && <SettingsNotice type="error" message={errorMessage} />}

      <SettingsForm
        formData={formData}
        isSaving={isSaving}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    </div>
  );
}