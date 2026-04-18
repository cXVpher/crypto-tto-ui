"use client";

import type { AdminMetric } from "@/app/admin/_types/admin-types";
import {
  formatCompactNumber,
  formatInteger,
  formatPrice,
  formatTokenAmount,
  formatUsd,
  getToneClasses,
} from "@/app/admin/_lib/admin-format";

function formatMetricValue(metric: AdminMetric) {
  switch (metric.format) {
    case "currency":
      return formatUsd(metric.value);
    case "token":
      return formatTokenAmount(metric.value);
    case "integer":
      return formatInteger(metric.value);
    case "price":
      return formatPrice(metric.value);
    case "compact":
    default:
      return formatCompactNumber(metric.value);
  }
}

interface StatCardProps {
  metric: AdminMetric;
  className?: string;
}

export function StatCard({ metric, className }: StatCardProps) {
  const tone = getToneClasses(metric.tone);

  return (
    <article
      className={`rounded-[1.75rem] border ${tone.border} bg-[#081224]/90 p-4 shadow-[0_20px_60px_-42px_rgba(14,116,144,0.9)] ${className ?? ""}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            {metric.label}
          </p>
          <p className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">
            {formatMetricValue(metric)}
          </p>
        </div>
        <span
          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${tone.border} ${tone.background} ${tone.text}`}
        >
          {metric.change}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-400">{metric.detail}</p>
    </article>
  );
}
