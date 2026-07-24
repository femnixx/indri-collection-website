"use client";

import { useState } from "react";
import { Users, Eye, Clock, RefreshCw, AlertCircle } from "lucide-react";

import { useAnalytics } from "./hooks/useAnalytics";
import { DATE_RANGE_OPTIONS, type DateRange } from "./lib/types";
import DashboardSkeleton from "./components/DashboardSkeleton";
import SummaryCard from "./components/SummaryCard";
import LineChart from "./components/LineChart";
import TrafficSourcesChart from "./components/TrafficSourcesChart";
import PopularPagesTable from "./components/PopularPagesTable";

const SUMMARY_CARD_CONFIG = [
  { key: "visitors", title: "Total Pengunjung", icon: <Users className="h-5 w-5 text-accent" />, accentBg: "bg-accent/10", accentDot: "bg-accent" },
  { key: "pageViews", title: "Tayangan Halaman", icon: <Eye className="h-5 w-5 text-highlight" />, accentBg: "bg-highlight/10", accentDot: "bg-highlight" },
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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-primary">
            Dashboard Analitik
          </h1>
          <p className="mt-1.5 text-sm text-slate-muted font-light">
            Jumlah kunjungan website Indri Collection
          </p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2.5 cursor-pointer rounded-xl bg-primary/80 text-white text-xs md:text-sm font-bold hover:opacity-90 transition-opacity shadow-md shadow-primary/20 shrink-0"
        >
          <RefreshCw className="h-4 w-4" />Muat Ulang
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-start gap-3 bg-danger/10 border border-danger/25 text-danger p-5 rounded-2xl shadow-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm mb-1">Gagal Memuat Data Analitik</p>
            <p className="text-xs text-danger">{error}</p>
          </div>
        </div>
      )}

      {data && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 ">
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
            <div className="lg:col-span-2 rounded-xl bg-card border border-card-border p-6 shadow-sm shadow-slate-light/60">
              <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                <div>
                  <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Tren Trafik</h2>
                  <p className="text-xs text-slate-muted mt-0.5">Pengunjung & tayangan per hari</p>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {DATE_RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setRange(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 ${range === opt.value
                          ? "bg-accent text-white shadow-sm shadow-accent/20 cursor-pointer"
                          : "bg-slate border border-slate-dark/30 text-slate-muted hover:bg-slate-light/80 cursor-pointer"
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
                <div className="flex h-64 items-center justify-center border-2 border-dashed border-slate-light rounded-xl mt-4 bg-secondary/50">
                  <p className="text-sm text-slate-muted font-light">
                    Belum ada data pengunjung untuk rentang waktu ini.
                  </p>
                </div>
              )}
            </div>

            {/* Traffic Sources */}
            <div className="rounded-2xl bg-card border border-card-border p-6 shadow-sm shadow-slate-light/60">
              <div className="mb-6">
                <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Sumber Trafik</h2>
                <p className="text-xs text-slate-muted mt-0.5">Distribusi asal pengunjung</p>
              </div>
              <TrafficSourcesChart sources={data.trafficSources} />
            </div>
          </div>

          {/* Popular Pages */}
          <div className="rounded-2xl bg-card border border-card-border shadow-sm shadow-slate-light/60 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-light">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">Halaman Terpopuler</h2>
              <p className="text-xs text-slate-muted mt-0.5">Halaman dengan tayangan terbanyak</p>
            </div>
            <PopularPagesTable pages={data.popularPages} />
          </div>
        </>
      )}
    </div>
  );
}