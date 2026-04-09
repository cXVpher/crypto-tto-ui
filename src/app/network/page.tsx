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
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="Network" />
      <div className="px-4 pt-4">
        <UserWallet />
        <NetworkTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <NetworkContent activeTab={activeTab} />
      </div>
    </div>
  );
}
