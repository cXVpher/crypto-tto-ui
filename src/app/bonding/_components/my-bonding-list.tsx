"use client";

import { motion } from "framer-motion";
import { ClipboardText } from "@phosphor-icons/react";
import type { BondingItem } from "@/app/_types/api-types";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatBalance } from "@/lib/utils";

interface MyBondingListProps {
  items: BondingItem[];
}

export function MyBondingList({ items }: MyBondingListProps) {
  if (items.length === 0) {
    return (
      <div className="px-4 pt-6">
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-4 w-4 items-center justify-center rounded"
            style={{ background: "rgba(126,194,255,0.18)" }}
          >
            <ClipboardText className="h-3 w-3" style={{ color: "#7ec2ff" }} />
          </div>
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            My Bonding List
          </h2>
        </div>

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
          No active bonding contracts yet.
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-6">
      <div className="mb-3 flex items-center gap-2">
        <div
          className="flex h-4 w-4 items-center justify-center rounded"
          style={{ background: "rgba(126,194,255,0.18)" }}
        >
          <ClipboardText className="h-3 w-3" style={{ color: "#7ec2ff" }} />
        </div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          My Bonding List
        </h2>
      </div>

      <div className="space-y-3">
        {items.map((bond, i) => (
          <motion.div
            key={bond.id}
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
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold" style={{ color: "#dbe5ff" }}>
                  {bond.packageName}
                </span>
                <span className="text-[11px] font-semibold" style={{ color: "#f5c451" }}>
                  x {formatBalance(bond.amount)} {bond.token}
                </span>
              </div>
              <button
                className="text-[10px] font-bold hover:underline"
                style={{ color: "#86cbff" }}
              >
                DETAIL
              </button>
            </div>
            <div className="flex items-center justify-between">
              <StatusBadge status={bond.status} />
              <span className="text-[10px]" style={{ color: "#98abd4" }}>
                {bond.startDate} - {bond.endDate}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
