"use client";

import { motion } from "framer-motion";
import { ClipboardText } from "@phosphor-icons/react";
import { StatusBadge } from "@/components/ui/status-badge";
import { myBondingList } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

export function MyBondingList() {
  return (
    <div className="px-4 pt-6">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-4 w-4 items-center justify-center rounded bg-gold/20">
          <ClipboardText className="h-3 w-3 text-gold" />
        </div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          My Bonding List
        </h2>
      </div>

      <div className="space-y-3">
        {myBondingList.map((bond, i) => (
          <motion.div
            key={bond.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="bg-navy-lighter/50 border border-white/5 rounded-xl p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-foreground">
                  {bond.packageName}
                </span>
                <span className="text-[11px] font-semibold text-true-gold">
                  x {formatBalance(bond.amount)} {bond.token}
                </span>
              </div>
              <button className="text-[10px] font-bold text-gold hover:underline">
                DETAIL
              </button>
            </div>
            <div className="flex items-center justify-between">
              <StatusBadge status={bond.status} />
              <span className="text-[10px] text-muted-foreground">
                {bond.startDate} - {bond.endDate}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
