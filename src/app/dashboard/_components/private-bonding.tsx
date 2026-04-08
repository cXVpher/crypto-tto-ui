"use client";

import { useRouter } from "next/navigation";
import { formatBalance } from "@/lib/utils";
import { TOKEN_SYMBOL } from "@/lib/mock-data";
import { useWallet } from "@/lib/wallet-context";
import { Lock, ChevronRight } from "lucide-react";

export function PrivateBonding() {
  const router = useRouter();
  const { privateBonding } = useWallet();

  return (
    <div className="mb-8">
      <div
        className="flex items-center justify-between p-4 rounded-xl"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div className="flex items-center gap-3">
          {/* Icon container */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: "rgba(218,158,255,0.15)" }}
          >
            <Lock className="w-5 h-5" style={{ color: "#da9eff" }} />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "#98abd4" }}>Private Bonding</p>
            <p className="text-lg font-bold" style={{ color: "#dbe5ff" }}>
              {formatBalance(privateBonding)}{" "}
              <span className="text-base" style={{ color: "#dbe5ff" }}>{TOKEN_SYMBOL}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/bonding/add")}
          className="text-sm font-semibold transition-opacity hover:opacity-80"
          style={{ color: "#6ab2ff" }}
        >
          View
        </button>
      </div>
    </div>
  );
}
