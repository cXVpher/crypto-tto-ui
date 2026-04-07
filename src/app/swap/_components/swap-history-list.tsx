"use client";

import { motion } from "framer-motion";
import { StatusBadge } from "@/components/ui/status-badge";
import { swapHistory } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

export function SwapHistoryList() {
  return (
    <div className="mt-8">
      <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Swap History
      </h2>
      <div className="space-y-3">
        {swapHistory.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-true-gold">
                {formatBalance(item.fromAmount)} {item.fromToken} →{" "}
                <span className="text-true-gold">
                  ${formatBalance(item.toAmount)} {item.toToken}
                </span>
              </span>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-[10px] text-muted-foreground">{item.date}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
