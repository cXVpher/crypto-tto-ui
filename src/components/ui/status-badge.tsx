// src/components/ui/status-badge.tsx
"use client";

import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colors: Record<string, string> = {
    RUNNING: "bg-cash/20 text-cash border-cash/30",
    COMPLETED: "bg-gold/20 text-gold border-gold/30",
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    FAILED: "bg-destructive/20 text-destructive border-destructive/30",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full border",
        colors[status.toUpperCase()] || colors.PENDING,
        className
      )}
    >
      {status}
    </span>
  );
}
