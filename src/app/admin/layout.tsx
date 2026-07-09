"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === "/admin/login") {
      setIsAuthorized(true);
      return;
    }

    const checkAuth = () => {
      const adminAccess = sessionStorage.getItem("admin_access");
      if (adminAccess === "true") {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
        router.replace("/admin/login");
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 text-gray-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-sm font-semibold tracking-wide animate-pulse text-gray-400">
          Mengamankan Sesi Administrator...
        </p>
      </div>
    );
  }

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-slate-50/80 text-gray-800 flex-col md:flex-row antialiased">
      {/* 🧭 Sidebar Navigasi Cerah (Sticky & Responsif) */}
      <AdminSidebar />

      {/* 📊 Area Konten Utama Dashboard */}
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}