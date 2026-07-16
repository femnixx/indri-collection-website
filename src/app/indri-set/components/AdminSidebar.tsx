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

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard Analitik", href: "/indri-set/dashboard", icon: LayoutDashboard },
    { name: "Kelola Koleksi Foto", href: "/indri-set/products", icon: Images },
    { name: "Pengaturan Panel", href: "/indri-set/settings", icon: Settings },
  ];

  const handleLogout = async () => {
  try {
    await supabaseAuth.auth.signOut();
    sessionStorage.removeItem("admin_access");
    router.replace("/admin/login");
  } catch (error) {
    console.error("Gagal melakukan proses keluar sesi:", error);
  }
};
  return (
    <>
      <div className="flex items-center justify-between bg-white px-4 py-3 border-b border-gray-200 md:hidden sticky top-0 z-40 w-full shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 p-1.5 flex items-center justify-center font-black text-white text-xs">
            IC
          </div>
          <span className="font-bold text-gray-900 text-sm tracking-wide">Indri Admin</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 text-gray-500 rounded-lg hover:bg-gray-100">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-xs" />}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 md:sticky md:top-0
        w-64 bg-white border-r border-gray-100 flex flex-col justify-between h-screen shrink-0
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6">
          <div className="hidden md:flex items-center gap-3 border-b border-gray-50 pb-6 mb-6">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center font-black text-white text-sm shadow-md shadow-blue-500/10">
              IC
            </div>
            <div>
              <h2 className="font-extrabold text-gray-900 text-sm tracking-wide">Indri Collection</h2>
              <p className="text-xs text-blue-600 font-bold tracking-wider uppercase mt-0.5">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 group ${
                    isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-600/15" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-200">
            <LogOut className="h-5 w-5" />
            Keluar Sesi
          </button>
        </div>
      </aside>
    </>
  );
}