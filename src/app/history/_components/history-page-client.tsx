"use client";

import { useState } from "react";
import type { PurchaseHistoryItem, WithdrawHistoryItem } from "@/lib/api-service";
import { PageHeader } from "@/components/layout/page-header";
import { HistoryTabs } from "./history-tabs";
import { HistoryContent } from "./history-content";

interface HistoryPageClientProps {
  purchaseHistory: PurchaseHistoryItem[];
  withdrawHistory: WithdrawHistoryItem[];
}

export function HistoryPageClient({
  purchaseHistory,
  withdrawHistory,
}: HistoryPageClientProps) {
  const [activeTab, setActiveTab] = useState<"purchase" | "withdraw">("purchase");
  const [tabDirection, setTabDirection] = useState<1 | -1>(1);

  function handleTabChange(tab: "purchase" | "withdraw") {
    if (tab === activeTab) return;

    setTabDirection(tab === "withdraw" ? 1 : -1);
    setActiveTab(tab);
  }

  return (
    <div
      className="flex min-h-screen flex-col pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="History" />
      <HistoryTabs activeTab={activeTab} setActiveTab={handleTabChange} />
      <HistoryContent
        activeTab={activeTab}
        direction={tabDirection}
        purchaseHistory={purchaseHistory}
        withdrawHistory={withdrawHistory}
      />
    </div>
  );
}
