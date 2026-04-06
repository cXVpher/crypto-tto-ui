// src/components/ui/stat-card.tsx
"use client";

import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export function StatCard({
  label,
  value,
  subtext,
  icon,
  className,
  valueClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-navy-lighter/50 border border-white/5 rounded-xl p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className="text-gold">{icon}</span>}
        <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className={cn("text-lg font-bold text-foreground", valueClassName)}>
        {value}
      </p>
      {subtext && (
        <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>
      )}
    </div>
  );
}
