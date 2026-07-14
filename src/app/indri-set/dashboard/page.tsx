"use client";

import React, { useState } from "react";
import { Users, Eye, Clock, Activity, RefreshCw, AlertCircle } from "lucide-react";

import { useAnalytics } from "./hooks/useAnalytics";
import { DATE_RANGE_OPTIONS, type DateRange } from "./lib/types";
import DashboardSkeleton from "./components/DashboardSkeleton";
import SummaryCard from "./components/SummaryCard";
import LineChart from "./components/LineChart";
import TrafficSourcesChart from "./components/TrafficSourcesChart";
import PopularPagesTable from "./components/PopularPagesTable";

const SUMMARY_CARD_CONFIG = [
  { key: "visitors", title: "Total Pengunjung", icon: <Users className="h-5 w-5 text-blue-600" />, accentBg: "bg-blue-50", accentDot: "bg-blue-600" },
  { key: "pageViews", title: "Tayangan Halaman", icon: <Eye className="h-5 w-5 text-indigo-600" />, accentBg: "bg-indigo-50", accentDot: "bg-indigo-600" },
  { key: "avgSessionDuration", title: "Rata-Rata Durasi Sesi", icon: <Clock className="h-5 w-5 text-amber-500" />, accentBg: "bg-amber-50", accentDot: "bg-amber-500" },
] as const;

export default function AdminDashboardPage() {
  const [range, setRange] = useState<DateRange>("30d");
  const { data, loading, error, refetch } = useAnalytics(range);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
            Dashboard Analitik
          </h1>
          <p className="mt-1.5 text-sm text-gray-400 font-light">
            Jumlah kunjungan website Indri Collection
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2.5 cursor-pointer rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm transition-all shrink-0"
        >
          <RefreshCw className="h-4 w-4" />Muat Ulang
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm mb-1">Gagal Memuat Data Analitik</p>
            <p className="text-xs text-red-500">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-3">
            {SUMMARY_CARD_CONFIG.map(({ key, title, accentBg }) => (
              <SummaryCard
                key={key}
                title={title}
                metric={data.summary[key]}
                accentBg={accentBg}
              />
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-6 shadow-sm shadow-gray-100/60">
              <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                <div>
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Tren Trafik</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Pengunjung & tayangan per hari</p>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRange(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${range === opt.value
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-600/20"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer"
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              {data.trafficTrend && data.trafficTrend.length > 0 ? (
                <LineChart data={data.trafficTrend} />
              ) : (
                <div className="flex h-64 items-center justify-center border-2 border-dashed border-gray-100 rounded-xl mt-4 bg-gray-50/50">
                  <p className="text-sm text-gray-400 font-light">
                    Belum ada data pengunjung untuk rentang waktu ini.
                  </p>
                </div>
              )}
            </div>

            {/* Traffic Sources */}
            <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm shadow-gray-100/60">
              <div className="mb-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Sumber Trafik</h2>
                <p className="text-xs text-gray-400 mt-0.5">Distribusi asal pengunjung</p>
              </div>
              <TrafficSourcesChart sources={data.trafficSources} />
            </div>
          </div>

          {/* Popular Pages */}
          <div className="rounded-2xl bg-white border border-gray-100 shadow-sm shadow-gray-100/60 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Halaman Terpopuler</h2>
              <p className="text-xs text-gray-400 mt-0.5">Halaman dengan tayangan terbanyak</p>
            </div>
            <PopularPagesTable pages={data.popularPages} />
          </div>
        </>
      )}
    </div>
  );
}