"use client";

import React, { useState } from "react";
import { Trash2, AlertCircle } from "lucide-react";
import Modal from "./Modal";
import { Category } from "../lib/types";

interface Props {
  category: Category | null;
  onConfirm: (cat: Category) => Promise<void>;
  onClose: () => void;
}

export default function DeleteCategoryModal({ category, onConfirm, onClose }: Props) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!category) return;
    setIsBusy(true);
    setError(null);
    try {
      await onConfirm(category);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Modal
      open={!!category}
      onClose={() => !isBusy && onClose()}
      title="Hapus Kategori"
      disableBackdropClose={isBusy}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
          <Trash2 className="h-6 w-6 text-danger" />
        </div>
        <p className="text-sm text-slate-muted">
          Kategori <span className="font-semibold text-primary">"{category?.name}"</span> dan semua
          produk di dalamnya akan dihapus permanen.
        </p>
        {error && (
          <p className="text-xs text-danger flex items-center gap-1 justify-center">
            <AlertCircle className="h-3 w-3 flex-shrink-0" /> {error}
          </p>
        )}
        <div className="flex gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isBusy}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-light bg-secondary text-primary text-sm font-semibold hover:bg-slate-light transition-colors disabled:opacity-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={handleDelete}
            disabled={isBusy}
            className="flex-1 px-4 py-2.5 rounded-xl bg-danger hover:bg-danger-dark text-white text-sm font-semibold transition-colors disabled:opacity-70 cursor-pointer flex items-center justify-center gap-2"
          >
            {isBusy ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Menghapus
              </>
            ) : (
              "Ya, Hapus"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
