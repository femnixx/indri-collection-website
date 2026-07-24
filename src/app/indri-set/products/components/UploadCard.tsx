"use client";

import React, { useState, useRef } from "react";
import { Upload, Loader2, X } from "lucide-react";
import Modal from "./Modal";
import { Category } from "../lib/types";

interface UploadDropzoneProps {
  isUploading: boolean;
  categories: Category[];
  onUpload: (file: File, fileName: string, categoryId?: string) => Promise<void>;
}

export default function UploadDropzone({ isUploading, categories, onUpload }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editedName, setEditedName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    if (!isUploading) fileInputRef.current?.click();
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    setSelectedFile(file);
    setEditedName(file.name.replace(/\.[^/.]+$/, ""));
  };

  const stopPropagation = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    stopPropagation(e);
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleConfirm = async () => {
    if (!selectedFile || !editedName.trim()) return;
    const ext = selectedFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const finalName = `${editedName.trim()}.${ext}`;
    await onUpload(selectedFile, finalName, selectedCategoryId || undefined);
    reset();
  };

  const reset = () => {
    setSelectedFile(null);
    setEditedName("");
    setSelectedCategoryId("");
  };

  return (
    <>
      <div
        onClick={openFilePicker}
        onDragOver={(e) => { stopPropagation(e); setIsDragging(true); }}
        onDragLeave={(e) => { stopPropagation(e); setIsDragging(false); }}
        onDrop={handleDrop}
        className={[
          "border-3 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all min-h-[160px]",
          isUploading
            ? "cursor-not-allowed opacity-60 border-slate-light bg-secondary"
            : isDragging
            ? "border-accent bg-accent/10 scale-[1.01] cursor-pointer"
            : "border-slate-dark hover:border-accent hover:bg-secondary cursor-pointer",
        ].join(" ")}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-accent animate-spin" />
            <p className="text-sm text-slate-muted">Mengunggah</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className={`p-3 rounded-full ${isDragging ? "bg-accent/20" : "bg-card"}`}>
              <Upload className={`h-6 w-6 ${isDragging ? "text-accent" : "text-slate-muted"}`} />
            </div>
            <p className="text-sm font-bold text-primary">
              {isDragging ? "Lepaskan Foto Di Sini" : "Klik atau Drag Foto"}
            </p>
            <p className="text-xs text-slate-muted">PNG, JPG hingga 5 MB</p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {/* Confirm Upload Modal */}
      <Modal
        open={!!selectedFile}
        onClose={reset}
        title="Konfirmasi Upload Foto"
        disableBackdropClose={isUploading}
      >
        {selectedFile && (
          <div className="flex flex-col gap-4">
            {/* Preview */}
            <div className="aspect-square rounded-xl overflow-hidden bg-secondary">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>

            {/* File name editor */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-primary">Nama File</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
                  autoFocus
                  maxLength={100}
                  placeholder="nama-file"
                  className="flex-1 text-sm border border-slate-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent bg-secondary text-primary"
                />
                <span className="text-xs text-slate-muted flex-shrink-0">
                  .{selectedFile.name.split(".").pop()?.toLowerCase() ?? "jpg"}
                </span>
              </div>
            </div>

            {/* Category selector */}
            {categories.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-primary">Kategori</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(e.target.value)}
                  className="w-full text-sm border border-slate-light rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-accent bg-secondary text-primary"
                >
                  <option value="">— Tanpa Kategori —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <button
                onClick={reset}
                disabled={isUploading}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-light text-sm font-semibold text-slate-dark hover:bg-slate-light transition-colors disabled:opacity-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={isUploading || !editedName.trim()}
                className="flex-1 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-highlight shadow-md shadow-accent/20 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {isUploading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Mengunggah
                  </>
                ) : (
                  "Upload Foto"
                )}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}