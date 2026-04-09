// src/app/swap/page.tsx
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { SwapBalance } from "./_components/swap-balance";
import { SwapForm } from "./_components/swap-form";
import { SwapHistoryList } from "./_components/swap-history-list";

export default function SwapPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="Swap" />

      <div className="px-4 pt-4">
        <SwapBalance />
        <SwapForm />
        <SwapHistoryList />
      </div>
    </div>
  );
}
