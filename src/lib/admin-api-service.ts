import { fetchApi } from "@/lib/fetcher";
import {
  adminActiveBondings,
  adminBondingPackages,
  adminPurchases,
  adminRecentActivity,
  adminRevenueSeries,
  adminSettingsData,
  adminSwaps,
  adminTokenData,
  adminUserGrowthSeries,
  adminUsers,
  adminWithdrawals,
} from "@/lib/admin-mock-data";
import type {
  AdminBondingData,
  AdminOverviewData,
  AdminSettingsData,
  AdminTokenData,
  AdminTransactionsData,
  AdminUsersData,
} from "@/lib/admin-types";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
const MOCK_DELAY_MS = 250;

function cloneData<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

async function resolveMock<T>(value: T) {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return cloneData(value);
}

function getAdminOverviewMockData(): AdminOverviewData {
  const totalBonded = adminActiveBondings
    .filter((item) => item.status === "RUNNING")
    .reduce((sum, item) => sum + item.amount, 0);
  const volume24h =
    adminPurchases.reduce((sum, item) => sum + item.amountUsdt, 0) +
    adminSwaps.reduce((sum, item) => sum + item.toUsdt, 0) +
    adminWithdrawals.reduce((sum, item) => sum + item.amount, 0);
  const activeBondings = adminActiveBondings.filter(
    (item) => item.status === "RUNNING"
  ).length;

  return {
    stats: [
      {
        label: "Total users",
        value: adminUsers.length,
        change: "+8.4%",
        detail: "compared with last week",
        tone: "cyan",
        format: "integer",
      },
      {
        label: "TVL",
        value: totalBonded,
        change: "+5.9%",
        detail: "running bonding volume",
        tone: "emerald",
        format: "token",
      },
      {
        label: "24h volume",
        value: volume24h,
        change: "+12.7%",
        detail: "purchases, swaps, withdrawals",
        tone: "amber",
        format: "currency",
      },
      {
        label: "Active bondings",
        value: activeBondings,
        change: "+2",
        detail: "currently running positions",
        tone: "cyan",
        format: "integer",
      },
      {
        label: "TTO price",
        value: adminTokenData.currentPrice,
        change: "+4.0%",
        detail: "latest market reference",
        tone: "emerald",
        format: "price",
      },
    ],
    revenueSeries: adminRevenueSeries,
    userGrowthSeries: adminUserGrowthSeries,
    recentActivity: adminRecentActivity,
    spotlight: [
      {
        label: "Withdrawal queue",
        value: "1 pending",
        description: "One manual withdrawal is waiting for admin approval.",
      },
      {
        label: "Risk review",
        value: "2 accounts",
        description: "Two accounts are flagged for transaction pattern review.",
      },
      {
        label: "Mock mode",
        value: USE_MOCK_API ? "Enabled" : "Disabled",
        description: "Admin screens follow the same mock flag as the wallet UI.",
      },
    ],
  };
}

function getAdminBondingMockData(): AdminBondingData {
  const packageBreakdown = adminBondingPackages.map((item) => ({
    label: item.name,
    value: adminActiveBondings
      .filter((bonding) => bonding.packageName === item.name)
      .reduce((sum, bonding) => sum + bonding.amount, 0),
  }));
  const runningCount = adminActiveBondings.filter(
    (item) => item.status === "RUNNING"
  ).length;
  const averageDurationDays =
    adminBondingPackages.reduce((sum, item) => sum + item.durationDays, 0) /
    adminBondingPackages.length;

  return {
    packages: adminBondingPackages,
    activeBondings: adminActiveBondings,
    packageBreakdown,
    summary: [
      {
        label: "Active packages",
        value: adminBondingPackages.filter((item) => item.status === "ACTIVE")
          .length,
        change: "4 live",
        detail: "available to wallet users",
        tone: "cyan",
        format: "integer",
      },
      {
        label: "Running bondings",
        value: runningCount,
        change: "+1 today",
        detail: "positions currently earning",
        tone: "emerald",
        format: "integer",
      },
      {
        label: "Average duration",
        value: averageDurationDays,
        change: "across configured packages",
        detail: "days per package",
        tone: "amber",
        format: "integer",
      },
    ],
  };
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  if (USE_MOCK_API) {
    return resolveMock(getAdminOverviewMockData());
  }

  return fetchApi<AdminOverviewData>("/v1/admin/stats");
}

export async function getAdminUsersData(): Promise<AdminUsersData> {
  if (USE_MOCK_API) {
    return resolveMock({ users: adminUsers });
  }

  return fetchApi<AdminUsersData>("/v1/admin/users");
}

export async function getAdminBondingData(): Promise<AdminBondingData> {
  if (USE_MOCK_API) {
    return resolveMock(getAdminBondingMockData());
  }

  return fetchApi<AdminBondingData>("/v1/admin/bonding");
}

export async function getAdminTransactionsData(): Promise<AdminTransactionsData> {
  if (USE_MOCK_API) {
    return resolveMock({
      purchases: adminPurchases,
      swaps: adminSwaps,
      withdrawals: adminWithdrawals,
    });
  }

  return fetchApi<AdminTransactionsData>("/v1/admin/transactions");
}

export async function getAdminTokenData(): Promise<AdminTokenData> {
  if (USE_MOCK_API) {
    return resolveMock(adminTokenData);
  }

  return fetchApi<AdminTokenData>("/v1/admin/token");
}

export async function getAdminSettingsData(): Promise<AdminSettingsData> {
  if (USE_MOCK_API) {
    return resolveMock(adminSettingsData);
  }

  return fetchApi<AdminSettingsData>("/v1/admin/settings");
}
