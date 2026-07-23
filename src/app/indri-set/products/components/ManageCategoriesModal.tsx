"use client";

import React from "react";
import { Tag, Pencil, Trash2 } from "lucide-react";
import Modal from "./Modal";
import { Category } from "../lib/types";

interface Props {
  open: boolean;
  categories: Category[];
  onRename: (cat: Category) => void;
  onDelete: (cat: Category) => void;
  onClose: () => void;
}

export default function ManageCategoriesModal({
  open,
  categories,
  onRename,
  onDelete,
  onClose,
}: Props) {
  return (
    <Modal open={open} onClose={onClose} title="Kelola Kategori">
      <div className="flex flex-col gap-3">
        {categories.length === 0 ? (
          <p className="text-sm text-slate-muted text-center py-4">Belum ada kategori.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-secondary border border-slate-light"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Tag className="h-3.5 w-3.5 text-slate-muted flex-shrink-0" />
                  <span className="text-sm font-semibold text-primary truncate">{cat.name}</span>
                  <span className="text-xs text-slate-muted flex-shrink-0">
                    ({cat.products?.length ?? 0} foto)
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onRename(cat)}
                    className="p-1.5 text-slate-muted hover:text-accent hover:bg-card rounded-lg transition-colors cursor-pointer"
                    title="Ubah Nama"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(cat)}
                    className="p-1.5 text-slate-muted hover:text-danger hover:bg-card rounded-lg transition-colors cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={onClose}
          className="mt-1 w-full px-4 py-2.5 rounded-xl bg-accent border border-slate-light text-sm font-bold text-white hover:bg-accent/90 transition-colors cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </Modal>
  );
}
