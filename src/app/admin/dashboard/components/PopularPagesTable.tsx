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
          <tr className="bg-gray-50/80 text-left">
            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Halaman</th>
            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Tayangan</th>
            <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Pengunjung</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {pages.map((page, index) => (
            <tr key={`${page.path}-${index}`} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4">
                <p className="font-semibold text-gray-800 truncate max-w-xs">{page.title}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{page.path}</p>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-gray-700">{page.views.toLocaleString("id-ID")}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <span className="font-bold text-gray-700">{page.visitors.toLocaleString("id-ID")}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
