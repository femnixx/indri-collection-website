// src/lib/mock-analytics.ts

export interface TrafficTrendItem {
  date: string;
  visitors: number;
  views: number;
}

export interface TrafficSourceItem {
  source: string;
  value: number;
  percentage: number;
}

export interface PopularPageItem {
  path: string;
  title: string;
  views: number;
  visitors: number;
}

export interface AnalyticsSummaryMetric {
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface AnalyticsData {
  summary: {
    visitors: AnalyticsSummaryMetric;
    pageViews: AnalyticsSummaryMetric;
    avgSessionDuration: AnalyticsSummaryMetric;
    bounceRate: AnalyticsSummaryMetric;
  };
  trafficTrend: TrafficTrendItem[];
  trafficSources: TrafficSourceItem[];
  popularPages: PopularPageItem[];
}

export function getMockAnalyticsData(): AnalyticsData {
  const trafficTrend: TrafficTrendItem[] = [];
  const today = new Date();

  // Generate trend data for the last 30 days
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const dateString = date.toISOString().split('T')[0];

    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const baseVisitors = isWeekend ? 120 : 280;
    const randomVariation = Math.floor(Math.random() * 60) - 30;
    const visitors = Math.max(10, baseVisitors + randomVariation);

    const multiplier = 2.5 + Math.random() * 1.5;
    const views = Math.floor(visitors * multiplier);

    trafficTrend.push({
      date: dateString,
      visitors,
      views,
    });
  }

  // Calculate sum of last 30 days
  const totalVisitors = trafficTrend.reduce((acc, curr) => acc + curr.visitors, 0);
  const totalViews = trafficTrend.reduce((acc, curr) => acc + curr.views, 0);

  return {
    summary: {
      visitors: {
        value: totalVisitors.toLocaleString('id-ID'),
        change: "+14.8%",
        trend: 'up'
      },
      pageViews: {
        value: totalViews.toLocaleString('id-ID'),
        change: "+21.2%",
        trend: 'up'
      },
      avgSessionDuration: {
        value: "2m 35s",
        change: "+5.4%",
        trend: 'up'
      },
      bounceRate: {
        value: "41.2%",
        change: "-3.1%",
        trend: 'down'
      }
    },
    trafficTrend,
    trafficSources: [
      { source: "Direct", value: Math.floor(totalVisitors * 0.35), percentage: 35 },
      { source: "Google Search (Organic)", value: Math.floor(totalVisitors * 0.42), percentage: 42 },
      { source: "Instagram (Social)", value: Math.floor(totalVisitors * 0.15), percentage: 15 },
      { source: "WhatsApp (Referral)", value: Math.floor(totalVisitors * 0.08), percentage: 8 }
    ],
    popularPages: [
      { path: "/", title: "Beranda - Indri Collection", views: Math.floor(totalViews * 0.55), visitors: Math.floor(totalVisitors * 0.60) },
      { path: "/#collection", title: "Koleksi Kami - Indri Collection", views: Math.floor(totalViews * 0.22), visitors: Math.floor(totalVisitors * 0.25) },
      { path: "/#about", title: "Tentang Kami - Indri Collection", views: Math.floor(totalViews * 0.13), visitors: Math.floor(totalVisitors * 0.12) },
      { path: "/#contact", title: "Kontak & Alamat - Indri Collection", views: Math.floor(totalViews * 0.10), visitors: Math.floor(totalVisitors * 0.10) }
    ]
  };
}
