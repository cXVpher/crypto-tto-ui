"use client";

import { motion } from "framer-motion";
import { useWallet } from "@/lib/wallet-context";
import { TOKEN_SYMBOL, TOKEN_PRICE_USDT } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

export function SwapBalance() {
  const { balance } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4 mb-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Account Balance
          </p>
          <p className="text-lg font-bold text-true-gold">
            {formatBalance(balance)}{" "}
            <span className="text-true-gold text-sm">{TOKEN_SYMBOL}</span>
          </p>
        </div>
        <p className="text-xs text-true-gold font-semibold">
          ~${formatBalance(balance * TOKEN_PRICE_USDT)}
        </p>
      </div>
    </motion.div>
  );
}
