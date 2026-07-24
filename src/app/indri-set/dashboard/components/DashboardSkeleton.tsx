import React from "react";

function Block({ className }: { className: string }) {
  return <div className={`animate-pulse bg-slate-light rounded-xl ${className}`} />;
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Block className="h-8 w-56 mb-2" />
        <Block className="h-4 w-72" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Block key={i} className="h-36 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Block className="lg:col-span-2 h-72 w-full" />
        <Block className="h-72 w-full" />
      </div>
      <Block className="h-52 w-full" />
    </div>
  );
}
