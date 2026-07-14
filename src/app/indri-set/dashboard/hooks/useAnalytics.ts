"use client";

import { useState, useEffect, useCallback } from "react";
import type { AnalyticsData } from "@/lib/mock-analytics";
import type { DateRange } from "../lib/types";

interface UseAnalyticsReturn {
  data: AnalyticsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAnalytics(range: DateRange): UseAnalyticsReturn {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch_ = useCallback(async () => {
    // Hanya set loading true jika belum ada data sama sekali (initial load)
    if (!data) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Gagal memuat data analytics.");
      setData(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan tak diketahui.");
    } finally {
      setLoading(false);
    }
  }, [range, data]);

  useEffect(() => {
    fetch_();
  }, [fetch_]);

  return { data, loading, error, refetch: fetch_ };
}
