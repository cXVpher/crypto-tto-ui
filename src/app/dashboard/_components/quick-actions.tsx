"use client";

import { useRouter } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <button
        onClick={() => router.push("/purchase")}
        className="flex h-14 items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all active:scale-95"
        style={{
          background: "linear-gradient(135deg, rgba(106,178,255,0.55) 0%, rgba(59,100,220,0.75) 100%)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          boxShadow: "0 4px 20px rgba(106,178,255,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
          color: "#ffffff",
        }}
      >
        <ArrowDown className="w-5 h-5" />
        Deposit
      </button>
      <button
        onClick={() => router.push("/withdraw")}
        className="flex h-14 items-center justify-center gap-2 rounded-xl font-bold text-sm transition-all active:scale-95"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          color: "#dbe5ff",
        }}
      >
        <ArrowUp className="w-5 h-5" />
        Withdraw
      </button>
    </div>
  );
}
