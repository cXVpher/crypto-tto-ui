// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/lib/wallet-context";

import { TopBar } from "./_components/top-bar";
import { InfoBanner } from "./_components/info-banner";
import { PrivateBonding } from "./_components/private-bonding";
import { MainBalanceCard } from "./_components/main-balance-card";
import { QuickActions } from "./_components/quick-actions";
import { HistoryLinks } from "./_components/history-links";
import { InviteFriend } from "./_components/invite-friend";

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useWallet();

  useEffect(() => {
    if (!isConnected) router.replace("/");
  }, [isConnected, router]);

  if (!isConnected) return null;

  return (
    <div className="flex flex-col min-h-screen pb-24">
      <TopBar />
      <div className="h-[57px]" aria-hidden="true" />

      <InfoBanner />
      <PrivateBonding />
      <MainBalanceCard />
      <QuickActions />
      <HistoryLinks />
      <InviteFriend />
    </div>
  );
}
