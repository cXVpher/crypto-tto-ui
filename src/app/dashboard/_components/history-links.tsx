"use client";

import Link from "next/link";
import { Eye } from "lucide-react";

export function HistoryLinks() {
  return (
    <div className="mx-4 mb-6">
      <Link
        href="/history"
        className="flex w-full items-center justify-center gap-1 rounded-xl border border-white/5 bg-navy-lighter/40 py-3 text-[11px] text-muted-foreground transition-colors hover:text-gold"
      >
        <Eye className="w-3 h-3" /> SHOW HISTORY
      </Link>
    </div>
  );
}
