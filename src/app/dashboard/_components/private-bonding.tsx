"use client";

import { useRouter } from "next/navigation";
import { formatBalance } from "@/lib/utils";
import { TOKEN_SYMBOL } from "@/lib/mock-data";
import { useWallet } from "@/lib/wallet-context";

export function PrivateBonding() {
  const router = useRouter();
  const { privateBonding } = useWallet();

  return (
    <div className="mx-4 mb-2 flex items-center justify-between">
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Private Bonding
        </p>
        <p className="text-sm font-bold text-true-gold">
          {formatBalance(privateBonding)} {TOKEN_SYMBOL}
        </p>
      </div>
      <button
        onClick={() => router.push("/bonding/add")}
        className="text-[10px] font-bold text-white bg-gold px-3 py-1.5 rounded-lg hover:bg-gold-dark transition-colors"
      >
        ADD NEW BONDING
      </button>
    </div>
  );
}
