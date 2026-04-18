"use client";

import { motion } from "framer-motion";
import { TOKEN_SYMBOL } from "@/app/_lib/mock-data";
import { formatBalance } from "@/lib/utils";
import { useWalletStore } from "@/store/use-wallet-store";

interface SwapBalanceProps {
  priceUsdt: number;
}

export function SwapBalance({ priceUsdt }: SwapBalanceProps) {
  const balance = useWalletStore((state) => state.balance);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6 rounded-xl border p-4"
      style={{
        background: "rgba(255,255,255,0.075)",
        borderColor: "rgba(126,194,255,0.09)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 10px 30px rgba(5, 12, 28, 0.16)",
      }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "#98abd4" }}>
            Account Balance
          </p>
          <p className="text-lg font-bold" style={{ color: "#f5c451" }}>
            {formatBalance(balance)}{" "}
            <span className="text-sm" style={{ color: "#f5c451" }}>
              {TOKEN_SYMBOL}
            </span>
          </p>
        </div>
        <p className="text-xs font-semibold" style={{ color: "#f5c451" }}>
          ~${formatBalance(balance * priceUsdt)}
        </p>
      </div>
    </motion.div>
  );
}
