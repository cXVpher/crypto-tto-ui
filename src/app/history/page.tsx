// src/app/history/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/page-header";
import { purchaseHistory, TOKEN_SYMBOL } from "@/lib/mock-data";
import { formatBalance } from "@/lib/utils";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"purchase" | "received">(
    "purchase"
  );

  const tabs = [
    { key: "purchase" as const, label: "PURCHASE" },
    { key: "received" as const, label: "RECEIVED" },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="Purchase History" />

      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex bg-navy-lighter/50 rounded-xl p-1 border border-white/5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 rounded-lg text-[11px] font-bold tracking-wider transition-all ${
                activeTab === tab.key
                  ? "bg-gold text-navy"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-4">
        {activeTab === "purchase" && purchaseHistory.length > 0 ? (
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
                  <span className="text-xs font-bold text-foreground">
                    {formatBalance(item.amount)} {item.token}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cash/10 text-cash border border-cash/20 font-bold">
                    {item.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">
                    Received: <span className="text-gold font-semibold">{formatBalance(item.received)} {item.receivedToken}</span>
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : activeTab === "received" ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-navy-lighter/50 flex items-center justify-center mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-sm text-muted-foreground">No History List</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-navy-lighter/50 flex items-center justify-center mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-sm text-muted-foreground">No History List</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
