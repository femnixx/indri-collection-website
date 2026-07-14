import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { AnalyticsSummaryMetric } from "@/lib/mock-analytics";

interface SummaryCardProps {
  title: string;
  metric: AnalyticsSummaryMetric;
  accentBg: string;
}

const TREND_STYLES = {
  up: "bg-emerald-50 text-emerald-600",
  down: "bg-red-50 text-red-600",
  neutral: "bg-gray-100 text-gray-500",
} as const;

const TrendIcon = ({ trend }: { trend: AnalyticsSummaryMetric["trend"] }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3" />;
  return <Minus className="h-3 w-3" />;
};

export default function SummaryCard({ title, metric, accentBg }: SummaryCardProps) {
  return (
    <div className="relative rounded-2xl bg-white border border-gray-100 p-6 shadow-sm shadow-gray-100/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {title}
      </p>
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${TREND_STYLES[metric.trend]}`}>
        <TrendIcon trend={metric.trend} />
        {metric.change}
      </span>
    </div>
    <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
      {metric.value}
    </p>
    
  </div>
  );
}
