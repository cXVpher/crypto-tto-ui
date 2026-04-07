"use client";

import { useRouter } from "next/navigation";

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="mx-4 flex gap-3 mb-2">
      <button
        onClick={() => router.push("/purchase")}
        className="btn-cash flex-1 py-3 rounded-xl text-sm font-bold tracking-wide"
      >
        DEPOSIT
      </button>
      <button
        onClick={() => router.push("/withdraw")}
        className="flex-1 py-3 rounded-xl text-sm font-bold tracking-wide bg-navy-lighter border border-white/10 text-foreground hover:bg-navy-lighter/80 transition-colors"
      >
        WITHDRAW
      </button>
    </div>
  );
}
