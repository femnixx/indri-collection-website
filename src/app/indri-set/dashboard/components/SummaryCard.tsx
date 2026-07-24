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
  down: "bg-danger/10 text-danger",
  neutral: "bg-slate-light text-slate-muted",
} as const;

const TrendIcon = ({ trend }: { trend: AnalyticsSummaryMetric["trend"] }) => {
  if (trend === "up") return <TrendingUp className="h-3 w-3" />;
  if (trend === "down") return <TrendingDown className="h-3 w-3" />;
  return <Minus className="h-3 w-3" />;
};

export default function SummaryCard({ title, metric, accentBg }: SummaryCardProps) {
  return (
    <div className="relative rounded-xl bg-card border border-card-border p-6 transition-all duration-200">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-muted">
        {title}
      </p>
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${TREND_STYLES[metric.trend]}`}>
        <TrendIcon trend={metric.trend} />
        {metric.change}
      </span>
    </div>
    <p className="text-2xl font-extrabold text-primary tracking-tight">
      {metric.value}
    </p>
    
  </div>
  );
}
