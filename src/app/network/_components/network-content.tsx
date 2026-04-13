"use client";

import { Handshake } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import type { NetworkAffiliateLevel } from "@/lib/api-service";
import { TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

interface NetworkContentProps {
  activeTab: "affiliate" | "matching";
  affiliates: NetworkAffiliateLevel[];
}

function AffiliatePanel({ affiliates }: { affiliates: NetworkAffiliateLevel[] }) {
  if (affiliates.length === 0) {
    return (
      <div className="py-14 text-center">
        <p className="text-sm" style={{ color: "#98abd4" }}>
          No affiliate wallets available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Network Affiliate
      </h3>
      {affiliates.map((level, index) => (
        <motion.div
          key={level.level}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-bold"
              style={{
                background: "rgba(59,130,246,0.1)",
                borderColor: "rgba(59,130,246,0.2)",
                color: "#3b82f6",
              }}
            >
              {level.label}
            </span>
            <span className="text-[10px] uppercase tracking-wider" style={{ color: "#98abd4" }}>
              Wallet Address
            </span>
          </div>
          <div className="space-y-2">
            {level.wallets.map((wallet, walletIndex) => (
              <motion.div
                key={walletIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.08 + walletIndex * 0.04,
                  duration: 0.22,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="rounded-xl border p-3"
                style={{
                  background: "rgba(255,255,255,0.075)",
                  borderColor: "rgba(126,194,255,0.09)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  boxShadow: "0 10px 30px rgba(5, 12, 28, 0.16)",
                }}
              >
                <div className="mb-1 flex items-center justify-between">
                  <span
                    className="mr-2 truncate text-[11px] font-mono"
                    style={{ color: "#dbe5ff" }}
                  >
                    {wallet.address}
                  </span>
                  <span
                    className="whitespace-nowrap text-[10px] font-bold"
                    style={{ color: "#f5c451" }}
                  >
                    {formatBalance(wallet.bonding)} {TOKEN_SYMBOL}
                  </span>
                </div>
                <p className="text-[9px]" style={{ color: "#98abd4" }}>
                  Invite Date: {wallet.inviteDate}
                </p>
                <p className="mt-0.5 text-[10px]" style={{ color: "#98abd4" }}>
                  BONDING
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function MatchingPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border"
        style={{
          background: "rgba(255,255,255,0.075)",
          borderColor: "rgba(126,194,255,0.09)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <Handshake className="h-7 w-7" style={{ color: "#86cbff" }} />
      </div>
      <p className="text-sm" style={{ color: "#98abd4" }}>
        No Matching History
      </p>
    </motion.div>
  );
}

export function NetworkContent({ activeTab, affiliates }: NetworkContentProps) {
  return (
    <div className="relative overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeTab === "affiliate" ? (
            <AffiliatePanel affiliates={affiliates} />
          ) : (
            <MatchingPanel />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
