import React from "react";
import type { TrafficSourceItem } from "@/lib/mock-analytics";

const SOURCE_COLOR_MAP: Record<string, string> = {
  Direct: "bg-blue-500",
  "Google Search": "bg-indigo-500",
  Instagram: "bg-pink-500",
  WhatsApp: "bg-emerald-500",
};

function getBarColor(source: string): string {
  for (const [key, cls] of Object.entries(SOURCE_COLOR_MAP)) {
    if (source.includes(key)) return cls;
  }
  return "bg-gray-400";
}

function SourceBar({ source, value, percentage }: TrafficSourceItem) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-gray-700 truncate max-w-[60%]">{source}</span>
        <span className="text-xs text-gray-400 font-medium ml-2">
          {value.toLocaleString("id-ID")} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
        <div
          className={`h-2.5 rounded-full transition-all duration-700 ease-out ${getBarColor(source)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface TrafficSourcesChartProps {
  sources: TrafficSourceItem[];
}

export default function TrafficSourcesChart({ sources }: TrafficSourcesChartProps) {
  return (
    <div className="space-y-5">
      {sources.map((src) => (
        <SourceBar key={src.source} {...src} />
      ))}
    </div>
  );
}
