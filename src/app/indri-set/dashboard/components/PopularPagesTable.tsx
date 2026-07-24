import React from "react";
import type { PopularPageItem } from "@/lib/mock-analytics";

interface PopularPagesTableProps {
  pages: PopularPageItem[];
}

export default function PopularPagesTable({ pages }: PopularPagesTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-light/30 text-left">
            <th className="px-6 py-3 text-xs font-bold text-slate-muted uppercase tracking-wider">Halaman</th>
            <th className="px-6 py-3 text-xs font-bold text-slate-muted uppercase tracking-wider text-right">Tayangan</th>
            <th className="px-6 py-3 text-xs font-bold text-slate-muted uppercase tracking-wider text-right">Pengunjung</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-light/30">
          {pages.map((page, index) => (
            <tr key={`${page.path}-${index}`} className="hover:bg-slate-light/10 transition-colors">
              <td className="px-6 py-4">
                <p className="font-semibold text-primary truncate max-w-xs">{page.title}</p>
                <p className="text-xs text-slate-muted font-mono mt-0.5">{page.path}</p>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-slate-dark">{page.views.toLocaleString("id-ID")}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-slate-dark">{page.visitors.toLocaleString("id-ID")}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
