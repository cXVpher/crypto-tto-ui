// src/app/swap/page.tsx
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { SwapBalance } from "./_components/swap-balance";
import { SwapForm } from "./_components/swap-form";
import { SwapHistoryList } from "./_components/swap-history-list";

export default function SwapPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="Swap" />

      <div className="px-4 pt-4">
        <SwapBalance />
        <SwapForm />
        <SwapHistoryList />
      </div>
    </div>
  );
}
