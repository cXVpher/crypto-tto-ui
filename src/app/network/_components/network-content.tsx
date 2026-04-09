"use client";

import { Handshake } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { networkAffiliates, TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

interface NetworkContentProps {
  activeTab: "affiliate" | "matching";
}

export function NetworkContent({ activeTab }: NetworkContentProps) {
  if (activeTab === "affiliate") {
    return (
      <div className="space-y-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Network Affiliate
        </h3>
        {networkAffiliates.map((level) => (
          <motion.div
            key={level.level}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: level.level * 0.1 }}
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-bold text-gold">
                {level.label}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Wallet Address
              </span>
            </div>
            <div className="space-y-2">
              {level.wallets.map((wallet, j) => (
                <div
                  key={j}
                  className="rounded-xl border border-white/5 bg-navy-lighter/50 p-3"
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className="mr-2 truncate text-[11px] font-mono text-foreground">
                      {wallet.address}
                    </span>
                    <span className="whitespace-nowrap text-[10px] font-bold text-true-gold">
                      {formatBalance(wallet.bonding)} {TOKEN_SYMBOL}
                    </span>
                  </div>
                  <p className="text-[9px] text-muted-foreground">
                    Invite Date: {wallet.inviteDate}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    BONDING
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-navy-lighter/50">
        <Handshake className="h-7 w-7 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">No Matching History</p>
    </motion.div>
  );
}
