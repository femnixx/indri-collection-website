"use client";

import React, { useState } from "react";
import { AlertCircle } from "lucide-react";
import Modal from "./Modal";

export interface CategoryFormModalProps {
  open: boolean;
  mode: "add" | "rename";
  initialValue?: string;
  onSubmit: (name: string) => Promise<void>;
  onClose: () => void;
}

export default function CategoryFormModal({
  open,
  mode,
  initialValue = "",
  onSubmit,
  onClose,
}: CategoryFormModalProps) {
  const [value, setValue] = useState(initialValue);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!value.trim()) return;
    setIsBusy(true);
    setError(null);
    try {
      await onSubmit(value.trim());
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  const reset = () => {
    setValue(initialValue);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={reset}
      title={mode === "add" ? "Tambah Kategori" : "Ubah Nama Kategori"}
      disableBackdropClose={isBusy}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-primary">
            {mode === "add" ? "Nama Kategori Baru" : "Nama Baru"}
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError(null);
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            autoFocus
            disabled={isBusy}
            maxLength={60}
            placeholder="mis. Gamis, Tunik, Hijab..."
            className="w-full text-sm border border-slate-light rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent bg-secondary text-primary disabled:opacity-50"
          />
          {error && (
            <p className="text-xs text-danger flex items-center gap-1">
              <AlertCircle className="h-3 w-3 flex-shrink-0" /> {error}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={reset}
            disabled={isBusy}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-light text-sm font-semibold text-slate-dark hover:bg-slate-light transition-colors disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isBusy || !value.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-highlight shadow-md shadow-accent/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            {isBusy ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Menyimpan
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
