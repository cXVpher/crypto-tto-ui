// src/app/network/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { useWallet } from "@/lib/wallet-context";
import { networkAffiliates, TOKEN_SYMBOL } from "@/lib/mock-data";
import { truncateAddress, formatBalance } from "@/lib/utils";

export default function NetworkPage() {
  const { walletAddress } = useWallet();
  const [activeTab, setActiveTab] = useState<"affiliate" | "matching">(
    "affiliate"
  );

  const tabs = [
    { key: "affiliate" as const, label: "AFFILIATE HISTORY" },
    { key: "matching" as const, label: "MATCHING HISTORY" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="Network" />

      <div className="px-4 pt-4">
        {/* User wallet */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 mb-4"
        >
          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-[10px] font-bold text-gold">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {truncateAddress(walletAddress)}
            </p>
            <p className="text-[10px] text-muted-foreground font-mono truncate">
              {walletAddress}
            </p>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(walletAddress)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/5"
          >
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-navy-lighter/50 rounded-xl p-1 border border-white/5 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold tracking-wider transition-all ${
                activeTab === tab.key
                  ? "bg-gold text-navy"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === "affiliate" && (
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
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                    {level.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Wallet Address
                  </span>
                </div>
                <div className="space-y-2">
                  {level.wallets.map((wallet, j) => (
                    <div
                      key={j}
                      className="bg-navy-lighter/50 border border-white/5 rounded-xl p-3"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono text-foreground truncate mr-2">
                          {wallet.address}
                        </span>
                        <span className="text-[10px] font-bold text-gold whitespace-nowrap">
                          {formatBalance(wallet.bonding)} {TOKEN_SYMBOL}
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground">
                        Invite Date: {wallet.inviteDate}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        BONDING
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === "matching" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-navy-lighter/50 flex items-center justify-center mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <p className="text-sm text-muted-foreground">
              No Matching History
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
