// src/app/history/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { HistoryTabs } from "./_components/history-tabs";
import { HistoryContent } from "./_components/history-content";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"purchase" | "withdraw">("purchase");

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="History" />
      <HistoryTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <HistoryContent activeTab={activeTab} />
    </div>
  );
}
