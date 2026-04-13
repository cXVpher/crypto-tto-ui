// src/app/dashboard/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/use-wallet-store";
import { useDashboardData } from "@/hooks/use-dashboard-data";

import { TopBar } from "./_components/top-bar";
import { MainBalanceCard } from "./_components/main-balance-card";
import { QuickActions } from "./_components/quick-actions";
import { PrivateBonding } from "./_components/private-bonding";
import { RecentActivity } from "./_components/recent-activity";

const dashboardPageStyles = {
  background:
    "radial-gradient(ellipse 80% 50% at 100% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
  color: "#dbe5ff",
} satisfies React.CSSProperties;

function DashboardLoadingState() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24"
      style={dashboardPageStyles}
    >
      <TopBar />

      <main className="flex-1 px-4">
        <section className="mt-6 mb-6 rounded-2xl bg-white/6 p-6 backdrop-blur-xl">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-28 rounded-full bg-white/10" />
            <div className="h-11 w-48 rounded-full bg-white/12" />
            <div className="h-4 w-24 rounded-full bg-white/10" />
          </div>
        </section>

        <section className="grid gap-4">
          <div className="h-24 animate-pulse rounded-2xl bg-white/6" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/6" />
          <div className="h-56 animate-pulse rounded-2xl bg-white/6" />
        </section>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const hasHydrated = useWalletStore((state) => state.hasHydrated);
  const isConnected = useWalletStore((state) => state.isConnected);
  const { data, isLoading, isError, refetch } = useDashboardData(
    hasHydrated && isConnected
  );

  useEffect(() => {
    if (hasHydrated && !isConnected) {
      router.replace("/");
    }
  }, [hasHydrated, isConnected, router]);

  if (!hasHydrated || !isConnected) return null;
  if (isLoading) return <DashboardLoadingState />;

  if (isError) {
    return (
      <div
        className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24"
        style={dashboardPageStyles}
      >
        <TopBar />

        <main className="flex flex-1 items-center px-4">
          <div className="w-full rounded-2xl bg-white/6 p-6 text-center backdrop-blur-xl">
            <h1 className="text-lg font-semibold" style={{ color: "#dbe5ff" }}>
              Unable to load dashboard data
            </h1>
            <p className="mt-2 text-sm" style={{ color: "#98abd4" }}>
              The token summary request failed. Try again to refresh the dashboard.
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 rounded-xl bg-[#6ab2ff] px-4 py-2 text-sm font-semibold text-[#031123] transition-opacity hover:opacity-90"
            >
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24"
      style={dashboardPageStyles}
    >
      <TopBar />

      <main className="flex-1 px-4">
        <MainBalanceCard tokenSymbol={data?.token.symbol} />
        <QuickActions />
        <PrivateBonding />
        <RecentActivity />
      </main>
    </div>
  );
}
