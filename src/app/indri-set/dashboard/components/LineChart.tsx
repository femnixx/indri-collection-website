"use client";

import React, { useState } from "react";
import type { TrafficTrendItem } from "@/lib/mock-analytics";

interface LineChartProps {
  data: TrafficTrendItem[];
}

const W = 600;
const H = 220;
const PAD = { top: 20, right: 20, bottom: 36, left: 48 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

const Y_FRACTIONS = [0, 0.25, 0.5, 0.75, 1];

function formatAxisDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

function formatAxisValue(v: number): string {
  return v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);
}

export default function LineChart({ data }: LineChartProps) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (data.length < 2) return null;

  const maxVal = Math.max(...data.map((d) => d.views), 1);
  const xStep = INNER_W / (data.length - 1);

  const xAt = (i: number) => PAD.left + i * xStep;
  const yAt = (v: number) => PAD.top + INNER_H - (v / maxVal) * INNER_H;

  const pathD = (key: "visitors" | "views") =>
    data.map((d, i) => `${i === 0 ? "M" : "L"}${xAt(i).toFixed(1)},${yAt(d[key]).toFixed(1)}`).join(" ");

  const fillD = (key: "visitors" | "views") =>
    `M${xAt(0).toFixed(1)},${(PAD.top + INNER_H).toFixed(1)} ` +
    pathD(key).slice(1) +
    ` L${xAt(data.length - 1).toFixed(1)},${(PAD.top + INNER_H).toFixed(1)}Z`;

  const yTicks = Array.from(new Set(Y_FRACTIONS.map((f) => Math.round(f * maxVal))));
  const xLabelIndices = Array.from(new Set(Array.from({ length: 5 }, (_, i) => Math.round((i / 4) * (data.length - 1)))));

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <div className="relative w-full" style={{ aspectRatio: `${W}/${H}` }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-full"
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
        </defs>

        {/* Y-axis grid & labels */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line x1={PAD.left} x2={PAD.left + INNER_W} y1={yAt(tick)} y2={yAt(tick)} stroke="#f1f5f9" strokeWidth={1} />
            <text x={PAD.left - 8} y={yAt(tick) + 4} textAnchor="end" fontSize={10} fill="#94a3b8">
              {formatAxisValue(tick)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {xLabelIndices.map((i) => (
          <text key={i} x={xAt(i)} y={H - 6} textAnchor="middle" fontSize={10} fill="#94a3b8">
            {formatAxisDate(data[i].date)}
          </text>
        ))}

        {/* Fill areas */}
        <path d={fillD("views")} fill="url(#gradViews)" opacity={0.25} />
        <path d={fillD("visitors")} fill="url(#gradVisitors)" opacity={0.25} />

        {/* Lines */}
        <path d={pathD("views")} fill="none" stroke="#6366f1" strokeWidth={2} strokeLinejoin="round" />
        <path d={pathD("visitors")} fill="none" stroke="#10b981" strokeWidth={2} strokeLinejoin="round" />

        {/* Hover crosshair & dots */}
        {hoverIdx !== null && (
          <>
            <line x1={xAt(hoverIdx)} x2={xAt(hoverIdx)} y1={PAD.top} y2={PAD.top + INNER_H} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="4 2" />
            <circle cx={xAt(hoverIdx)} cy={yAt(data[hoverIdx].views)} r={4} fill="#6366f1" />
            <circle cx={xAt(hoverIdx)} cy={yAt(data[hoverIdx].visitors)} r={4} fill="#10b981" />
          </>
        )}

        {/* Invisible hit areas */}
        {data.map((_, i) => (
          <rect
            key={i}
            x={xAt(i) - xStep / 2}
            y={PAD.top}
            width={xStep}
            height={INNER_H}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
          />
        ))}
      </svg>

      {/* Floating tooltip */}
      {hovered !== null && hoverIdx !== null && (
        <div
          className="absolute pointer-events-none z-10 bg-gray-900 text-white text-xs rounded-xl px-3 py-2 shadow-xl whitespace-nowrap"
          style={{
            left: `${(xAt(hoverIdx) / W) * 100}%`,
            top: `${(yAt(hovered.visitors) / H) * 100}%`,
            transform: "translate(-50%, -130%)",
          }}
        >
          <p className="font-bold mb-1">{hovered.date}</p>
          <p className="text-indigo-300">Tayangan: <span className="text-white font-semibold">{hovered.views.toLocaleString("id-ID")}</span></p>
          <p className="text-emerald-300">Pengunjung: <span className="text-white font-semibold">{hovered.visitors.toLocaleString("id-ID")}</span></p>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-0 right-0 flex items-center gap-4 text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-indigo-500 rounded-full inline-block" />Tayangan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-emerald-500 rounded-full inline-block" />Pengunjung
        </span>
      </div>
    </div>
  );
}
