"use client";

import { motion } from "framer-motion";
import { TrendUp } from "@phosphor-icons/react";
import { TOKEN_SYMBOL } from "@/app/_lib/mock-data";
import { formatBalance } from "@/lib/utils";
import { useWalletStore } from "@/store/use-wallet-store";

interface MainBalanceCardProps {
  tokenSymbol?: string;
}

export function MainBalanceCard({
  tokenSymbol = TOKEN_SYMBOL,
}: MainBalanceCardProps) {
  const balance = useWalletStore((state) => state.balance);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
      className="mt-6 mb-6 relative p-6 rounded-2xl overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      {/* Background ambient blob */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "rgba(106,178,255,0.1)", filter: "blur(40px)" }}
      />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium uppercase tracking-wide" style={{ color: "#98abd4" }}>
            Account Balance
          </p>
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: "rgba(234,179,8,0.2)", border: "1px solid rgba(234,179,8,0.5)" }}
          >
            <span className="text-lg" style={{ color: "#eab308" }}>₮</span>
          </div>
        </div>

        {/* Balance */}
        <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: "#dbe5ff" }}>
          {formatBalance(balance)}{" "}
          <span className="text-2xl font-semibold" style={{ color: "#6ab2ff" }}>
            {tokenSymbol}
          </span>
        </h1>

        {/* Trend */}
        <div className="flex items-center gap-1.5 text-sm font-medium" style={{ color: "#4ade80" }}>
          <TrendUp className="w-4 h-4" />
          <span>+4.2% today</span>
        </div>
      </div>
    </motion.div>
  );
}
