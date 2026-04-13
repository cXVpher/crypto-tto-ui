"use client";

import { motion } from "framer-motion";
import type { SwapHistoryItem } from "@/lib/api-service";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatBalance } from "@/lib/utils";

interface SwapHistoryListProps {
  history: SwapHistoryItem[];
}

export function SwapHistoryList({ history }: SwapHistoryListProps) {
  if (history.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Swap History
        </h2>
        <div
          className="rounded-xl border p-5 text-center text-sm"
          style={{
            background: "rgba(255,255,255,0.075)",
            borderColor: "rgba(126,194,255,0.09)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "#98abd4",
          }}
        >
          No swap activity yet.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Swap History
      </h2>
      <div className="space-y-3">
        {history.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="rounded-xl border p-4"
            style={{
              background: "rgba(255,255,255,0.075)",
              borderColor: "rgba(126,194,255,0.09)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 10px 30px rgba(5, 12, 28, 0.16)",
            }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: "#f5c451" }}>
                {formatBalance(item.fromAmount)} {item.fromToken} {"->"}{" "}
                <span style={{ color: "#f5c451" }}>
                  ${formatBalance(item.toAmount)} {item.toToken}
                </span>
              </span>
              <StatusBadge status={item.status} />
            </div>
            <p className="text-[10px]" style={{ color: "#98abd4" }}>
              {item.date}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
