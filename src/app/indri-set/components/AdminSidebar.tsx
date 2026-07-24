"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { supabaseAuth } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    { name: "Dashboard Analitik", href: "/indri-set/dashboard", icon: LayoutDashboard },
    { name: "Kelola Koleksi Foto", href: "/indri-set/products", icon: Images },
    { name: "Pengaturan Kontak", href: "/indri-set/settings", icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await supabaseAuth.auth.signOut();
      sessionStorage.removeItem("admin_access");
      router.replace("/indri-set/login");
    } catch (error) {
      console.error("Gagal melakukan proses keluar sesi:", error);
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between bg-sidebar px-4 py-3 border-b border-gray-200 xl:hidden sticky top-0 z-30 w-auto shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(true)} className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        <img 
          src="/avatar.png" 
          alt="Profile" 
          className="h-8 w-8 rounded-full object-cover border border-gray-200 shadow-sm"
        />
      </div>

      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-black/20 z-40 xl:hidden backdrop-blur-sm transition-opacity" 
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 xl:sticky xl:top-0
        w-64 bg-sidebar border-r border-gray-100 flex flex-col h-screen shrink-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}
      `}>
        
        <div className="p-4 md:p-6 border-b border-gray-50 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-primary text-sm tracking-wide">Indri Collection</h2>
            <p className="text-[11px] text-accent font-bold tracking-wider uppercase mt-0.5">Admin Panel</p>
          </div>

          <div className="flex items-center gap-2">
            <img 
              src="/avatar.png" 
              alt="Profile" 
              className="h-10 w-10 rounded-full object-cover border border-slate-light shadow-sm" 
            />

            <button 
              onClick={() => setIsOpen(false)} 
              className="xl:hidden p-1.5 text-slate-muted rounded-lg hover:bg-danger/10 hover:text-danger transition-colors cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                  isActive 
                    ? "bg-accent text-white shadow-md shadow-accent/20" 
                    : "text-slate-muted hover:bg-slate-light/50 hover:text-primary"
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-muted group-hover:text-slate-dark"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-light bg-slate-light/10">
          <button 
            onClick={() => setShowLogoutModal(true)} 
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-danger hover:bg-danger/10 hover:shadow-sm transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Keluar
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-70 md:w-full shadow-2xl border border-slate-light space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <LogOut className="h-6 w-6 stroke-[2.5] text-danger" />
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-primary">Apakah Anda yakin ingin keluar?</h3>
                <p className="text-xs text-slate-muted leading-relaxed">
                  Anda perlu masuk kembali untuk mengakses panel ini.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <Button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-light text-sm font-bold text-slate-dark hover:bg-slate-light transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </Button>
              <Button
                type="button"
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 rounded-xl bg-danger text-sm font-bold text-white hover:bg-danger-dark shadow-md shadow-danger/20 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingOut ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Keluar</span>
                  </>
                ) : (
                  "Ya, Keluar"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}