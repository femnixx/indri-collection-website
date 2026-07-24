"use client";

import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  disableBackdropClose?: boolean;
}

export default function Modal({ open, onClose, title, children, disableBackdropClose }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={disableBackdropClose ? undefined : onClose}
      />
      {/* Panel */}
      <div
        className="relative z-10 bg-card border border-card-border rounded-2xl shadow-2xl w-full max-w-sm mx-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-light">
          <h3 className="text-base font-bold text-primary">{title}</h3>
          <button
            onClick={onClose}
            disabled={disableBackdropClose}
            className="p-1.5 rounded-lg text-slate-muted hover:text-danger hover:bg-secondary transition-colors disabled:opacity-50 cursor-pointer"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {/* Content */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
