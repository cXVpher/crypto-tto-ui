"use client";

import { motion } from "framer-motion";
import { Clock3 } from "lucide-react";
import { purchaseHistory, withdrawHistory } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

interface HistoryContentProps {
  activeTab: "purchase" | "withdraw";
}

export function HistoryContent({ activeTab }: HistoryContentProps) {
  if (activeTab === "purchase") {
    return (
      <div className="px-4 pt-4">
        {purchaseHistory.length > 0 ? (
          <div className="space-y-3">
            {purchaseHistory.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-true-gold">
                    {formatBalance(item.amount)} {item.token}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cash/10 text-cash border border-cash/20 font-bold">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] text-muted-foreground">
                    Received:{" "}
                    <span className="text-true-gold font-semibold">
                      {formatBalance(item.received)} {item.receivedToken}
                    </span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <EmptyHistoryState label="purchase" />
        )}
      </div>
    );
  }

  return (
    <div className="px-4 pt-4">
      {withdrawHistory.length > 0 ? (
        <div className="space-y-3">
          {withdrawHistory.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-true-gold">
                  {formatBalance(item.amount)} {item.token}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cash/10 text-cash border border-cash/20 font-bold">
                  {item.status}
                </span>
              </div>
              <div className="space-y-1.5">
                <span className="block text-[11px] text-muted-foreground">
                  Wallet:{" "}
                  <span className="text-true-gold font-semibold">
                    {item.wallet}
                  </span>
                </span>
                <div className="flex items-center justify-between gap-3 text-[10px] text-muted-foreground">
                  <span>
                    Fee:{" "}
                    <span className="text-foreground">
                      {formatBalance(item.fee)} {item.token}
                    </span>
                  </span>
                  <span>{item.date}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <EmptyHistoryState label="withdraw" />
      )}
    </div>
  );
}

function EmptyHistoryState({ label }: { label: "purchase" | "withdraw" }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-lighter/50">
        <Clock3 className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No {label} history yet</p>
    </motion.div>
  );
}
