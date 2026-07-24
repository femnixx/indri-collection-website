"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "./components/AdminSidebar";
import { supabaseAuth } from "@/lib/supabaseClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (pathname === "/indri-set/login") {
      setIsAuthorized(true);
      return;
    }

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabaseAuth.auth.getSession();

        if (session) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          router.replace("/indri-set/login");
        }
      } catch (err) {
        setIsAuthorized(false);
        router.replace("/indri-set/login");
      }
    };

    checkAuth();
  }, [router, pathname]);

  // Loading state
  if (isAuthorized === null) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-gray-600">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-accent)] border-t-transparent mb-4"></div>
        <p className="text-sm font-semibold tracking-wide animate-pulse text-gray-400">
          Mengamankan Sesi Administrator...
        </p>
      </div>
    );
  }

  if (pathname === "/indri-set/login") {
    return <>{children}</>;
  }

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen bg-background text-slate-800 flex-col xl:flex-row antialiased">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}