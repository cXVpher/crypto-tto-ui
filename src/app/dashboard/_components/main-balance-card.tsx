"use client";

import { motion } from "framer-motion";
import { CoinLogo } from "@/components/ui/coin-logo";
import { useWallet } from "@/lib/wallet-context";
import { formatBalance } from "@/lib/utils";
import { TOKEN_SYMBOL } from "@/lib/mock-data";

export function MainBalanceCard() {
  const { balance } = useWallet();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className="mx-4 mt-4 mb-6 bg-gradient-to-br from-navy-lighter/80 to-navy-light/50 border border-white/5 rounded-2xl px-6 pt-8 pb-4 text-center relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-gold/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center pt-2">
        <div className="mb-7">
          <CoinLogo size={84} animate={false} className="mx-auto" />
        </div>
        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">
          Account Balance
        </p>
        <div className="flex items-baseline justify-center gap-2 mb-1">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-true-gold"
          >
            {formatBalance(balance)}
          </motion.span>
          <span className="text-sm font-bold text-true-gold">{TOKEN_SYMBOL}</span>
        </div>
      </div>
    </motion.div>
  );
}
