"use client";

import React, { useState } from "react";
import { Trash2, Pencil, Check, X, Tag } from "lucide-react";
import Modal from "./Modal";
import { Product, Category } from "../lib/types";

interface ProductCardProps {
  item: Product;
  categories: Category[];
  onDelete: (item: Product) => Promise<void>;
  onUpdateName: (id: string, name: string) => Promise<void>;
  onUpdateCategory: (id: string, categoryId: string | null) => Promise<void>;
}

export default function ProductCard({ item, categories, onDelete, onUpdateName, onUpdateCategory }: ProductCardProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const withBusy = async (fn: () => Promise<void>) => {
    setIsBusy(true);
    try { await fn(); } finally { setIsBusy(false); }
  };

  const handleSaveName = () =>
    withBusy(async () => {
      if (editName.trim() && editName !== item.name) await onUpdateName(item.id, editName.trim());
      setIsEditingName(false);
    });

  const handleCategoryChange = (val: string) =>
    withBusy(() => onUpdateCategory(item.id, val || null));

  const handleDelete = () =>
    withBusy(async () => {
      await onDelete(item);
      setShowDeleteModal(false);
    });

  const currentCategory = categories.find((c) => c.id === item.category_id);

  return (
    <>
      <div className="group relative bg-card border border-card-border rounded-2xl overflow-hidden shadow-sm flex flex-col hover:-translate-y-1 hover:shadow-xl transition-shadow duration-200">
        {/* Image */}
        <div className="aspect-square bg-secondary relative">
          <img src={item.image_url} className="w-full h-full object-cover" alt={item.name} />
          {/* Delete overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isBusy}
              className="p-2 bg-danger text-white rounded-xl hover:bg-danger-dark transition-colors shadow-lg cursor-pointer disabled:opacity-50"
              title="Hapus Foto"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Name row */}
        <div className="px-4 pt-3 pb-1 flex items-center gap-2 border-t border-slate-light">
          {isEditingName ? (
            <div className="flex w-full items-center gap-1">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setIsEditingName(false); }}
                autoFocus
                disabled={isBusy}
                className="w-full text-sm font-bold border border-slate-light rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-accent bg-secondary text-primary"
              />
              <button onClick={handleSaveName} disabled={isBusy} className="p-1 text-accent hover:bg-secondary rounded cursor-pointer disabled:opacity-50">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => { setEditName(item.name); setIsEditingName(false); }} disabled={isBusy} className="p-1 text-danger hover:bg-secondary rounded cursor-pointer disabled:opacity-50">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <h4 className="text-sm font-bold truncate flex-1 text-primary" title={item.name}>{item.name}</h4>
              <button
                onClick={() => { setEditName(item.name); setIsEditingName(true); }}
                disabled={isBusy}
                className="p-1.5 text-slate-muted hover:text-accent transition-colors flex-shrink-0 cursor-pointer disabled:opacity-50"
                title="Edit Nama"
              >
                <Pencil className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Category row */}
        <div className="px-4 pb-3 flex items-center gap-2">
          <Tag className="h-3.5 w-3.5 text-slate-muted flex-shrink-0" />
          <select
            value={item.category_id ?? ""}
            onChange={(e) => handleCategoryChange(e.target.value)}
            disabled={isBusy}
            className="flex-1 text-xs border-0 bg-transparent outline-none text-slate-muted hover:text-primary cursor-pointer disabled:opacity-50 truncate"
          >
            <option value="">-- Tanpa Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {currentCategory && (
            <span className="text-xs font-medium text-accent truncate hidden sm:block">{currentCategory.name}</span>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        open={showDeleteModal}
        onClose={() => !isBusy && setShowDeleteModal(false)}
        title="Hapus Foto"
        disableBackdropClose={isBusy}
      >
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
            <Trash2 className="h-6 w-6 text-danger" />
          </div>
          <p className="text-sm text-slate-muted">
            Foto <span className="font-semibold text-primary">"{item.name}"</span> akan dihapus
            secara permanen dan tidak bisa dikembalikan.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={() => setShowDeleteModal(false)}
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
                <><span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menghapus</>
              ) : "Ya, Hapus"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}