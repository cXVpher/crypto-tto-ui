// src/app/network/page.tsx
"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { UserWallet } from "./_components/user-wallet";
import { NetworkTabs } from "./_components/network-tabs";
import { NetworkContent } from "./_components/network-content";

export default function NetworkPage() {
  const [activeTab, setActiveTab] = useState<"affiliate" | "matching">("affiliate");

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="Network" />
      <div className="px-4 pt-4">
        <UserWallet />
        <NetworkTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <NetworkContent activeTab={activeTab} />
      </div>
    </div>
  );
}
