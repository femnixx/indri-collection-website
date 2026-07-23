"use client";

import React from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface NoticeProps {
  type: "success" | "error";
  message: string;
}

export function SettingsNotice({ type, message }: NoticeProps) {
  if (type === "success") {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl shadow-xs">
        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
        <div className="text-sm font-semibold">{message}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-danger/10 border border-danger/25 text-danger p-4 rounded-xl shadow-xs">
      <AlertCircle className="h-5 w-5 text-danger shrink-0" />
      <div className="text-sm font-semibold">{message}</div>
    </div>
  );
}
