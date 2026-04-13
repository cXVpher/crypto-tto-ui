// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/use-wallet-store";

import { TopBar } from "./_components/top-bar";
import { MainBalanceCard } from "./_components/main-balance-card";
import { QuickActions } from "./_components/quick-actions";
import { PrivateBonding } from "./_components/private-bonding";
import { RecentActivity } from "./_components/recent-activity";

export default function DashboardPage() {
  const router = useRouter();
  const hasHydrated = useWalletStore((state) => state.hasHydrated);
  const isConnected = useWalletStore((state) => state.isConnected);

  useEffect(() => {
    if (hasHydrated && !isConnected) {
      router.replace("/");
    }
  }, [hasHydrated, isConnected, router]);

  if (!hasHydrated || !isConnected) return null;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 100% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}>
      <TopBar />

      <main className="flex-1 px-4">
        <MainBalanceCard />
        <QuickActions />
        <PrivateBonding />
        <RecentActivity />
      </main>
    </div>
  );
}
