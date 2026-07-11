// src/lib/google-analytics.ts
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { AnalyticsData, TrafficTrendItem, TrafficSourceItem, PopularPageItem } from './mock-analytics';

const hasCredentials =
  process.env.GA_PROPERTY_ID &&
  process.env.GA_CLIENT_EMAIL &&
  process.env.GA_PRIVATE_KEY;

let client: BetaAnalyticsDataClient | null = null;
if (hasCredentials) {
  try {
    client = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GA_CLIENT_EMAIL,
        private_key: process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
    });
  } catch (error) {
    console.error('Failed to initialize GA4 Client:', error);
  }
}

function formatDate(dateStr: string): string {
  if (dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
}

const RANGE_TO_GA4_DATE: Record<string, string> = {
  "3d": "3daysAgo",
  "7d": "7daysAgo",
  "30d": "30daysAgo",
  "90d": "90daysAgo",
  "365d": "365daysAgo",
};

// Returns null if credentials are missing or call fails.
export async function getGA4AnalyticsData(range: string='30d'): Promise<AnalyticsData | null> {
  if (!client || !process.env.GA_PROPERTY_ID) {
    console.warn('GA4 credentials or Property ID missing. Running in mock/fallback mode.');
    return null;
  }

  const propertyId = process.env.GA_PROPERTY_ID;
  const startDate = RANGE_TO_GA4_DATE[range] ?? "30daysAgo";
  const days = parseInt(range) || 30;
  const prevEndDate = `${days + 1}daysAgo`;
  const prevStartDate = `${days * 2}daysAgo`;

  try {
    // 1. Fetch Traffic Trend (Daily active users and page views for last 30 days)
    const [trendResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' }
      ],
      orderBys: [{ dimension: { dimensionName: 'date' } }]
    });

    const trafficTrend: TrafficTrendItem[] = (trendResponse.rows || []).map(row => {
      const dateStr = row.dimensionValues?.[0]?.value || '';
      const visitors = parseInt(row.metricValues?.[0]?.value || '0', 10);
      const views = parseInt(row.metricValues?.[1]?.value || '0', 10);
      return {
        date: formatDate(dateStr),
        visitors,
        views
      };
    });

    // 2. Fetch Popular Pages
    const [pagesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' }
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'activeUsers' }
      ],
      limit: 10,
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
    });

    const popularPages: PopularPageItem[] = (pagesResponse.rows || []).map(row => {
      return {
        path: row.dimensionValues?.[0]?.value || '/',
        title: row.dimensionValues?.[1]?.value || 'Untitled',
        views: parseInt(row.metricValues?.[0]?.value || '0', 10),
        visitors: parseInt(row.metricValues?.[1]?.value || '0', 10)
      };
    });

    // 3. Fetch Traffic Sources
    const [sourcesResponse] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      dimensions: [{ name: 'sessionSourceMedium' }],
      metrics: [{ name: 'activeUsers' }],
      limit: 5,
      orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }]
    });

    let totalSourceVisitors = 0;
    const rawSources = (sourcesResponse.rows || []).map(row => {
      const source = row.dimensionValues?.[0]?.value || 'Direct / None';
      const value = parseInt(row.metricValues?.[0]?.value || '0', 10);
      totalSourceVisitors += value;
      return { source, value };
    });

    const trafficSources: TrafficSourceItem[] = rawSources.map(src => {
      const percentage = totalSourceVisitors > 0 ? Math.round((src.value / totalSourceVisitors) * 100) : 0;
      // Clean up common source medium names for better UI display
      let sourceName = src.source;
      if (sourceName === '(direct) / (none)') sourceName = 'Direct';
      else if (sourceName.includes('google / organic')) sourceName = 'Google Search';
      else if (sourceName.includes('instagram')) sourceName = 'Instagram';
      else if (sourceName.includes('whatsapp')) sourceName = 'WhatsApp';

      return {
        source: sourceName,
        value: src.value,
        percentage
      };
    });

    // 4. Fetch Summary Metrics for current and previous 30 days for comparisons
    // Current period (last 30 days)
    const [currentSummary] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate, endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ]
    });

    // Previous period (60 days ago to 31 days ago)
    const [previousSummary] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: prevStartDate, endDate: prevEndDate }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ]
    });

    const currMetric = currentSummary.rows?.[0]?.metricValues;
    const prevMetric = previousSummary.rows?.[0]?.metricValues;

    const currVisitors = parseInt(currMetric?.[0]?.value || '0', 10);
    const prevVisitors = parseInt(prevMetric?.[0]?.value || '0', 10);

    const currPageViews = parseInt(currMetric?.[1]?.value || '0', 10);
    const prevPageViews = parseInt(prevMetric?.[1]?.value || '0', 10);

    const currDuration = parseFloat(currMetric?.[2]?.value || '0');
    const prevDuration = parseFloat(prevMetric?.[2]?.value || '0');

    const currBounce = parseFloat(currMetric?.[3]?.value || '0');
    const prevBounce = parseFloat(prevMetric?.[3]?.value || '0');

    // Helper to calculate percentage change
    const getChangeStr = (curr: number, prev: number, isBounceRate = false): { value: string; trend: 'up' | 'down' | 'neutral' } => {
      if (prev === 0) return { value: '0%', trend: 'neutral' };
      const change = ((curr - prev) / prev) * 100;
      const sign = change > 0 ? '+' : '';
      const formatted = `${sign}${change.toFixed(1)}%`;

      let trend: 'up' | 'down' | 'neutral' = 'neutral';
      if (change > 0.5) trend = 'up';
      else if (change < -0.5) trend = 'down';

      return { value: formatted, trend };
    };

    const visitorsChange = getChangeStr(currVisitors, prevVisitors);
    const viewsChange = getChangeStr(currPageViews, prevPageViews);
    const durationChange = getChangeStr(currDuration, prevDuration);
    const bounceChange = getChangeStr(currBounce, prevBounce);

    // Format Average Session Duration into clean string: e.g. "2m 14s"
    const formatDuration = (seconds: number): string => {
      const m = Math.floor(seconds / 60);
      const s = Math.round(seconds % 60);
      return `${m}m ${s}s`;
    };

    return {
      summary: {
        visitors: {
          value: currVisitors.toLocaleString('id-ID'),
          change: visitorsChange.value,
          trend: visitorsChange.trend
        },
        pageViews: {
          value: currPageViews.toLocaleString('id-ID'),
          change: viewsChange.value,
          trend: viewsChange.trend
        },
        avgSessionDuration: {
          value: formatDuration(currDuration),
          change: durationChange.value,
          trend: durationChange.trend
        },
        bounceRate: {
          value: `${(currBounce * 100).toFixed(1)}%`,
          change: bounceChange.value,
          trend: bounceChange.trend === 'up' ? 'down' : bounceChange.trend === 'down' ? 'up' : 'neutral' // down is good for bounce rate
        }
      },
      trafficTrend,
      trafficSources,
      popularPages
    };
  } catch (error: any) {
    console.error('Error fetching data from Google Analytics 4 API:', error.message);
    return null;
  }
}
