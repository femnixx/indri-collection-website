"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { id: 1, name: "Total Pendapatan", value: "Rp 14.250.000", change: "+12.5%", type: "up" },
    { id: 2, name: "Pesanan Baru", value: "48 Pesanan", change: "+8.2%", type: "up" },
    { id: 3, name: "Produk Aktif", value: "124 Item", change: "0%", type: "neutral" },
    { id: 4, name: "Konversi Pengunjung", value: "3.4%", change: "-0.5%", type: "down" },
  ];

  return (
    <div className="space-y-8">
      {/* 🌟 Header Panel */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
          Dashboard Analitik
        </h1>
        <p className="mt-1.5 text-sm text-gray-500 font-light">
          Selamat datang kembali! Berikut adalah ringkasan performa toko Indri Collection hari ini.
        </p>
      </div>

      {/* 📈 Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="relative overflow-hidden rounded-2xl bg-white p-6 border border-gray-100 shadow-sm shadow-gray-200/30 transition-all duration-200 hover:shadow-md"
          >
            <dt className="text-xs font-bold uppercase tracking-wider text-gray-400 truncate">
              {stat.name}
            </dt>
            <dd className="mt-3 flex items-baseline justify-between">
              <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
                {stat.value}
              </div>
              <div
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                  stat.type === "up"
                    ? "bg-emerald-50 text-emerald-600"
                    : stat.type === "down"
                    ? "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {stat.type === "up" && <TrendingUp className="h-3 w-3" />}
                {stat.type === "down" && <TrendingDown className="h-3 w-3" />}
                {stat.type === "neutral" && <Minus className="h-3 w-3" />}
                {stat.change}
              </div>
            </dd>
          </div>
        ))}
      </div>

      {/* 📦 Layouting Grafik & Aktivitas */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Kiri: Visualisasi Data Utama */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-6 h-96 flex flex-col justify-between shadow-sm shadow-gray-200/30">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Grafik Penjualan Terbaru</h3>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">7 Hari Terakhir</span>
          </div>
          <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl my-4 bg-gray-50/50">
            <p className="text-sm text-gray-400 font-light">Visualisasi grafik penjualan akan dirender di sini</p>
          </div>
        </div>

        {/* Kolom Kanan: Feed Log Aktivitas Terbaru */}
        <div className="rounded-2xl bg-white border border-gray-100 p-6 h-96 flex flex-col shadow-sm shadow-gray-200/30">
          <div className="border-b border-gray-100 pb-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Aktivitas Terkini</h3>
          </div>
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-3 text-sm border-b border-gray-50/80 pb-3.5 last:border-0 last:pb-0">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 shrink-0 shadow-xs shadow-blue-500/30" />
                <div>
                  <p className="text-gray-700 font-semibold">Pesanan baru #IC-102{item} masuk</p>
                  <p className="text-xs text-gray-400 font-light mt-0.5">30 menit yang lalu</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}