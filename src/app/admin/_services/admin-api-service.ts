import "server-only";

import { fetchAdminBackendApi } from "@/app/admin/_services/admin-backend-api";
import { fetchApi } from "@/lib/fetcher";
import {
  adminActiveBondings,
  adminPurchases,
  adminRecentActivity,
  adminRevenueSeries,
  adminSettingsData,
  adminSwaps,
  adminTokenData,
  adminUserGrowthSeries,
  adminUsers,
  adminWithdrawals,
  mockAdminBondingConfigResponse,
  mockAdminBondingsResponse,
  mockAdminDepositsResponse,
  mockAdminUserMetaById,
  mockAdminUsersResponse,
  mockAdminWithdrawalsResponse,
} from "@/app/admin/_services/admin-mock-data";
import type {
  AdminBondingData,
  AdminBondingPackage,
  AdminBondingRecord,
  AdminMetric,
  AdminOverviewData,
  AdminPageMeta,
  AdminPurchase,
  AdminSettingsData,
  AdminTokenData,
  AdminTransactionsData,
  AdminTransactionStatus,
  AdminUser,
  AdminUserContext,
  AdminUsersData,
  AdminWithdrawal,
} from "@/app/admin/_types/admin-types";
import { mockBondingPackagesResponse } from "@/app/_lib/mock-data";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";
const MOCK_DELAY_MS = 250;

interface AdminStatsResponse {
  users?: {
    total?: number;
    newToday?: number;
    withActiveBonding?: number;
  };
  bonding?: {
    totalActiveBondings?: number;
    totalLockedTto?: number;
    totalProfitPaidTto?: number;
  };
  deposit?: {
    totalDepositUsdt?: number;
    totalDepositToday?: number;
    totalTtoDistributed?: number;
  };
  swap?: {
    totalSwappedTto?: number;
    totalNetUsdt?: number;
  };
  withdraw?: {
    totalWithdrawnUsdt?: number;
    pendingWithdrawals?: number;
  };
  referral?: {
    totalReferralBonusTto?: number;
    totalMatchingBonusTto?: number;
  };
}

interface AdminConfigResponse {
  ttoPriceUsdt?: number;
  useMarketPrice?: boolean;
  swapFeePercentage?: number;
  withdrawNetworkFeeUsdt?: number;
}

interface AdminUsersResponseItem {
  id?: string;
  walletAddress?: string;
  titanLevel?: number;
  isAdmin?: boolean;
  totalPersonalBonding?: number;
  ttoBalance?: number;
  ttoLocked?: number;
  usdtBalance?: number;
  activeBondings?: number;
  totalDownline?: number;
  createdAt?: string;
}

interface AdminBondingResponseItem {
  id?: string;
  userId?: string;
  walletAddress?: string;
  packageId?: string;
  principalTto?: number;
  dailyRate?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  totalProfitPaid?: number;
}

interface AdminBondingConfigResponseItem {
  packageId?: string;
  label?: string;
  dailyRate?: number;
  maxDailyRate?: number;
  updatedAt?: string;
}

interface PublicBondingPackageResponseItem {
  id?: string;
  packageId?: string;
  label?: string;
  name?: string;
  durationDays?: number;
  days?: number;
  minAmount?: number;
  minTtoAmount?: number;
}

interface AdminDepositResponseItem {
  id?: string;
  userId?: string;
  walletAddress?: string;
  phaseName?: string;
  usdtAmount?: number;
  ttoAmount?: number;
  status?: string;
  txHashPayment?: string;
  createdAt?: string;
}

interface AdminWithdrawalResponseItem {
  id?: string;
  userId?: string;
  walletAddress?: string;
  usdtAmount?: number;
  networkFeeUsdt?: number;
  netUsdt?: number;
  recipientAddress?: string;
  status?: string;
  createdAt?: string;
}

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

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function toString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function round(value: number, digits = 6) {
  return Number(value.toFixed(digits));
}

function formatAdminDate(value: unknown, includeTime = true) {
  if (!value) {
    return "Unavailable";
  }

  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      : {}),
  });

  return formatter.format(date).replace(",", "");
}

function deriveUsername(walletAddress: string) {
  const normalizedWallet = walletAddress.replace(/\.\.\./g, "");
  const first4 = normalizedWallet.slice(0, 4);
  const last4 = normalizedWallet.slice(-4);
  return `User${first4}${last4}`;
}

function getRankLabel(level: number) {
  return level > 0 ? `Titan ${level}` : "None";
}

function mapLiveBondingStatus(status: string): AdminBondingRecord["status"] {
  if (status === "completed") {
    return "MATURED";
  }

  if (status === "cancelled") {
    return "CANCELLED";
  }

  return "RUNNING";
}

function mapLiveTransactionStatus(status: string): AdminTransactionStatus {
  switch (status) {
    case "verified":
      return "VERIFIED";
    case "processing":
      return "PROCESSING";
    case "failed":
      return "FAILED";
    case "completed":
      return "COMPLETED";
    case "pending":
    default:
      return "PENDING";
  }
}

function getOverviewMockMeta(source: AdminPageMeta["source"], notice?: string): AdminPageMeta {
  return {
    source,
    notice,
  };
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
    meta: getOverviewMockMeta("mock"),
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
        label: "Mode",
        value: "Mock",
        description: "Admin screens are running against local prototype data.",
      },
    ],
  };
}

function getAdminUsersMockData(): AdminUsersData {
  const users = mockAdminUsersResponse.map((item) => {
    const walletAddress = toString(item.walletAddress);
    const activeBondings = toNumber(item.activeBondings);
    const meta = mockAdminUserMetaById[toString(item.id)];

    return {
      id: toString(item.id),
      walletAddress,
      username: deriveUsername(walletAddress),
      rank: getRankLabel(toNumber(item.titanLevel)),
      registeredAt: formatAdminDate(item.createdAt, false),
      totalBonding: toNumber(item.totalPersonalBonding),
      status: meta?.status ?? "ACTIVE",
      bondingStatus:
        meta?.status === "SUSPENDED"
          ? "ENDED"
          : activeBondings > 0
            ? "RUNNING"
            : "IDLE",
      referrals: toNumber(item.totalDownline),
      lastActive: meta?.lastActive ?? "Unavailable",
      isAdmin: Boolean(item.isAdmin),
      ttoBalance: toNumber(item.ttoBalance),
      ttoLocked: toNumber(item.ttoLocked),
      usdtBalance: toNumber(item.usdtBalance),
    } satisfies AdminUser;
  });

  const packageLabelById = new Map(
    mockAdminBondingConfigResponse.map((item) => [toString(item.packageId), toString(item.label)])
  );
  const bondings = mockAdminBondingsResponse.map((item) => ({
    id: toString(item.id),
    userWallet: toString(item.walletAddress),
    packageName:
      packageLabelById.get(toString(item.packageId)) ?? toString(item.packageId, "Package"),
    amount: toNumber(item.principalTto),
    startDate: formatAdminDate(item.startDate, false),
    endDate: formatAdminDate(item.endDate, false),
    status: mapLiveBondingStatus(toString(item.status, "active")),
  }));
  const purchases = mockAdminDepositsResponse.map(mapAdminPurchase);
  const withdrawals = mockAdminWithdrawalsResponse.map(mapAdminWithdrawal);
  const userIdToWallet = new Map(
    mockAdminBondingsResponse.map((item) => [toString(item.userId), toString(item.walletAddress)])
  );

  return {
    meta: {
      source: "mock",
    },
    users,
    contexts: buildLiveUserContexts(users, bondings, purchases, withdrawals, userIdToWallet),
    capabilities: {
      suspend: true,
    },
  };
}

function buildBondingSummary(
  packages: AdminBondingPackage[],
  activeBondings: AdminBondingRecord[]
): AdminMetric[] {
  const runningCount = activeBondings.filter((item) => item.status === "RUNNING").length;
  const averageDurationDays =
    packages.reduce((sum, item) => sum + item.durationDays, 0) / Math.max(packages.length, 1);

  return [
    {
      label: "Active packages",
      value: packages.filter((item) => item.status === "ACTIVE").length,
      change: `${packages.length} total`,
      detail: "available in the current package catalogue",
      tone: "cyan",
      format: "integer",
    },
    {
      label: "Running bondings",
      value: runningCount,
      change: `${activeBondings.length} visible`,
      detail: "positions currently visible in this panel",
      tone: "emerald",
      format: "integer",
    },
    {
      label: "Average duration",
      value: averageDurationDays,
      change: "catalogue average",
      detail: "days across configured package variants",
      tone: "amber",
      format: "integer",
    },
  ];
}

function getAdminBondingMockData(): AdminBondingData {
  const publicPackageById = new Map(
    mockBondingPackagesResponse.map((item) => [toString(item.packageId ?? item.id), item])
  );
  const packages = mockAdminBondingConfigResponse.map((item) => {
    const publicPackage = publicPackageById.get(toString(item.packageId));

    return {
      id: toString(item.packageId),
      packageId: toString(item.packageId),
      name: toString(item.label, toString(item.packageId, "Bonding Package")),
      durationDays: toNumber(publicPackage?.durationDays),
      dailyProfitRate: round(toNumber(item.dailyRate) * 100, 4),
      minAmount: toNumber(publicPackage?.minTtoAmount, 100),
      status: toString(item.packageId) === "pkg-720" ? "INACTIVE" : "ACTIVE",
      maxDailyRate: round(toNumber(item.maxDailyRate) * 100, 4),
      updatedAt: formatAdminDate(item.updatedAt),
      supportsRateEdit: true,
    } satisfies AdminBondingPackage;
  });
  const packageNameById = new Map(packages.map((item) => [item.packageId, item.name]));
  const activeBondings = mockAdminBondingsResponse.map((item) => ({
    id: toString(item.id),
    userWallet: toString(item.walletAddress),
    packageName:
      packageNameById.get(toString(item.packageId)) ?? toString(item.packageId, "Bonding Package"),
    amount: toNumber(item.principalTto),
    startDate: formatAdminDate(item.startDate, false),
    endDate: formatAdminDate(item.endDate, false),
    status: mapLiveBondingStatus(toString(item.status, "active")),
  }));
  const packageBreakdown = packages.map((item) => ({
    label: item.name,
    value: activeBondings
      .filter((bonding) => bonding.packageName === item.name)
      .reduce((sum, bonding) => sum + bonding.amount, 0),
  }));

  return {
    meta: {
      source: "mock",
    },
    packages,
    activeBondings,
    packageBreakdown,
    summary: buildBondingSummary(packages, activeBondings),
    capabilities: {
      createPackage: true,
      togglePackage: true,
      updateRate: true,
    },
  };
}

function getAdminTransactionsMockData(): AdminTransactionsData {
  return {
    meta: {
      source: "mock",
    },
    purchases: mockAdminDepositsResponse.map(mapAdminPurchase),
    swaps: adminSwaps,
    withdrawals: mockAdminWithdrawalsResponse.map(mapAdminWithdrawal),
    capabilities: {
      liveSwaps: true,
      retryFailedWithdrawal: false,
      reviewPendingWithdrawal: true,
    },
  };
}

function getAdminTokenMockData(): AdminTokenData {
  return {
    ...adminTokenData,
    meta: {
      source: "mock",
    },
    capabilities: {
      updatePrice: true,
      editMetadata: true,
    },
  };
}

function getAdminSettingsMockData(): AdminSettingsData {
  return {
    meta: {
      source: "mock",
    },
    swapFeePercent: 1.5,
    flatFeeUsdt: adminSettingsData.flatFeeUsdt,
    maintenanceMode: adminSettingsData.maintenanceMode,
    announcement: adminSettingsData.announcement,
    activityLog: adminSettingsData.activityLog,
    capabilities: {
      updateFees: true,
      maintenanceMode: true,
      announcement: true,
    },
  };
}

async function getAdminStats() {
  return fetchAdminBackendApi<AdminStatsResponse>("/v1/admin/stats");
}

async function getAdminConfig() {
  return fetchAdminBackendApi<AdminConfigResponse>("/v1/admin/config");
}

async function getAdminUsers() {
  const response = await fetchAdminBackendApi<AdminUsersResponseItem[]>("/v1/admin/users", {
    query: {
      page: 1,
      limit: 100,
    },
  });

  return response;
}

async function getAdminBondings() {
  return fetchAdminBackendApi<AdminBondingResponseItem[]>("/v1/admin/bondings", {
    query: {
      page: 1,
      limit: 100,
    },
  });
}

async function getAdminBondingConfig() {
  return fetchAdminBackendApi<AdminBondingConfigResponseItem[]>("/v1/admin/bonding/config");
}

async function getPublicBondingPackages() {
  return fetchApi<PublicBondingPackageResponseItem[]>("/v1/bonding/packages");
}

async function getAdminDeposits() {
  return fetchAdminBackendApi<AdminDepositResponseItem[]>("/v1/admin/deposits", {
    query: {
      page: 1,
      limit: 100,
    },
  });
}

async function getAdminWithdrawals() {
  return fetchAdminBackendApi<AdminWithdrawalResponseItem[]>("/v1/admin/withdrawals", {
    query: {
      page: 1,
      limit: 100,
    },
  });
}

function mapAdminPurchase(item: AdminDepositResponseItem): AdminPurchase {
  const walletAddress = toString(item.walletAddress);

  return {
    id: toString(item.id),
    user: deriveUsername(walletAddress),
    amountUsdt: toNumber(item.usdtAmount),
    receivedTto: toNumber(item.ttoAmount),
    date: formatAdminDate(item.createdAt),
    status: mapLiveTransactionStatus(toString(item.status, "pending")),
    txHash: item.txHashPayment ?? null,
    phaseName: toString(item.phaseName, "Presale"),
  };
}

function mapAdminWithdrawal(item: AdminWithdrawalResponseItem): AdminWithdrawal {
  const walletAddress = toString(item.walletAddress);

  return {
    id: toString(item.id),
    user: deriveUsername(walletAddress),
    amount: toNumber(item.usdtAmount),
    wallet: toString(item.recipientAddress),
    fee: toNumber(item.networkFeeUsdt),
    date: formatAdminDate(item.createdAt),
    status: mapLiveTransactionStatus(toString(item.status, "processing")),
    txHash: null,
    netAmount: toNumber(item.netUsdt),
  };
}

function buildLiveUserContexts(
  users: AdminUser[],
  bondings: AdminBondingRecord[],
  purchases: AdminPurchase[],
  withdrawals: AdminWithdrawal[],
  userIdToWallet: Map<string, string>
) {
  const contexts: Record<string, AdminUserContext> = {};

  for (const user of users) {
    contexts[user.id] = {
      bondings: [],
      purchases: [],
      swaps: [],
      withdrawals: [],
    };
  }

  const walletToUserId = new Map(
    Array.from(userIdToWallet.entries()).map(([userId, wallet]) => [wallet, userId])
  );

  for (const item of bondings) {
    const userId = walletToUserId.get(item.userWallet);
    if (userId && contexts[userId]) {
      contexts[userId].bondings.push(item);
    }
  }

  for (const item of purchases) {
    const userId = users.find((user) => user.username === item.user)?.id;
    if (userId && contexts[userId]) {
      contexts[userId].purchases.push(item);
    }
  }

  for (const item of withdrawals) {
    const userId = users.find((user) => user.username === item.user)?.id;
    if (userId && contexts[userId]) {
      contexts[userId].withdrawals.push(item);
    }
  }

  return contexts;
}

export async function getAdminOverviewData(): Promise<AdminOverviewData> {
  if (USE_MOCK_API) {
    return resolveMock(getAdminOverviewMockData());
  }

  const [stats, config] = await Promise.all([getAdminStats(), getAdminConfig()]);

  return {
    meta: {
      source: "hybrid",
      notice:
        "Top-line admin metrics are live. Trend charts and the activity feed still use prototype data because the current admin API does not expose time-series analytics or a live event feed.",
    },
    stats: [
      {
        label: "Total users",
        value: toNumber(stats.users?.total),
        change: `+${toNumber(stats.users?.newToday)} today`,
        detail: `${toNumber(stats.users?.withActiveBonding)} users with active bonding`,
        tone: "cyan",
        format: "integer",
      },
      {
        label: "TVL",
        value: toNumber(stats.bonding?.totalLockedTto),
        change: `${toNumber(stats.bonding?.totalActiveBondings)} active`,
        detail: "live locked TTO from active bondings",
        tone: "emerald",
        format: "token",
      },
      {
        label: "24h deposits",
        value: toNumber(stats.deposit?.totalDepositToday),
        change: `${toNumber(stats.deposit?.totalDepositUsdt)} total`,
        detail: "live deposit volume from the admin service",
        tone: "amber",
        format: "currency",
      },
      {
        label: "Withdrawal queue",
        value: toNumber(stats.withdraw?.pendingWithdrawals),
        change: `${toNumber(stats.withdraw?.totalWithdrawnUsdt)} withdrawn`,
        detail: "processing withdrawals currently tracked",
        tone: "cyan",
        format: "integer",
      },
      {
        label: "TTO price",
        value: toNumber(config.ttoPriceUsdt, adminTokenData.currentPrice),
        change: config.useMarketPrice ? "market driven" : "manual config",
        detail: "current admin config reference price",
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
        value: `${toNumber(stats.withdraw?.pendingWithdrawals)} processing`,
        description: "Live count from the admin withdrawal queue.",
      },
      {
        label: "Referral payout",
        value: `${round(toNumber(stats.referral?.totalReferralBonusTto), 2)} TTO`,
        description: "Total referral bonus tracked by the backend admin service.",
      },
      {
        label: "Mode",
        value: "Hybrid",
        description: "Live metrics with prototype charts until the admin API exposes richer analytics feeds.",
      },
    ],
  };
}

export async function getAdminUsersData(): Promise<AdminUsersData> {
  if (USE_MOCK_API) {
    return resolveMock(getAdminUsersMockData());
  }

  const [usersResponse, bondingsResponse, depositsResponse, withdrawalsResponse, configItems] =
    await Promise.all([
      getAdminUsers(),
      getAdminBondings(),
      getAdminDeposits(),
      getAdminWithdrawals(),
      getAdminBondingConfig(),
    ]);

  const users = usersResponse.map((item) => {
    const walletAddress = toString(item.walletAddress);
    const activeBondings = toNumber(item.activeBondings);

    return {
      id: toString(item.id),
      walletAddress,
      username: deriveUsername(walletAddress),
      rank: getRankLabel(toNumber(item.titanLevel)),
      registeredAt: formatAdminDate(item.createdAt),
      totalBonding: toNumber(item.totalPersonalBonding),
      status: "ACTIVE" as const,
      bondingStatus: activeBondings > 0 ? "RUNNING" : "IDLE",
      referrals: toNumber(item.totalDownline),
      lastActive: "Unavailable",
      isAdmin: Boolean(item.isAdmin),
      ttoBalance: toNumber(item.ttoBalance),
      ttoLocked: toNumber(item.ttoLocked),
      usdtBalance: toNumber(item.usdtBalance),
    } satisfies AdminUser;
  });

  const packageLabelById = new Map(
    configItems.map((item) => [toString(item.packageId), toString(item.label)])
  );

  const bondings = bondingsResponse.map((item) => ({
    id: toString(item.id),
    userWallet: toString(item.walletAddress),
    packageName:
      packageLabelById.get(toString(item.packageId)) ?? toString(item.packageId, "Package"),
    amount: toNumber(item.principalTto),
    startDate: formatAdminDate(item.startDate, false),
    endDate: formatAdminDate(item.endDate, false),
    status: mapLiveBondingStatus(toString(item.status, "active")),
  }));

  const purchases = depositsResponse.map(mapAdminPurchase);
  const withdrawals = withdrawalsResponse.map(mapAdminWithdrawal);
  const userIdToWallet = new Map(
    bondingsResponse.map((item) => [toString(item.userId), toString(item.walletAddress)])
  );

  return {
    meta: {
      source: "hybrid",
      notice:
        "The user registry is live. The current admin API still does not expose suspension state, last activity, or all-user swap history, so those parts of the screen are simplified.",
    },
    users,
    contexts: buildLiveUserContexts(
      users,
      bondings,
      purchases,
      withdrawals,
      userIdToWallet
    ),
    capabilities: {
      suspend: true,
    },
  };
}

export async function getAdminBondingData(): Promise<AdminBondingData> {
  if (USE_MOCK_API) {
    return resolveMock(getAdminBondingMockData());
  }

  const [publicPackages, configItems, bondingItems] = await Promise.all([
    getPublicBondingPackages(),
    getAdminBondingConfig(),
    getAdminBondings(),
  ]);

  const publicPackageByLabel = new Map(
    publicPackages.map((item) => [
      toString(item.label ?? item.name, toString(item.packageId ?? item.id)),
      item,
    ])
  );

  const packages = configItems.map((item) => {
    const name = toString(item.label, toString(item.packageId, "Bonding Package"));
    const publicPackage = publicPackageByLabel.get(name);
    const durationDays = toNumber(
      publicPackage?.durationDays ?? publicPackage?.days,
      toNumber(String(name).match(/\d+/)?.[0], 0)
    );

    return {
      id: toString(item.packageId),
      packageId: toString(item.packageId),
      name,
      durationDays,
      dailyProfitRate: round(toNumber(item.dailyRate) * 100, 4),
      minAmount: toNumber(publicPackage?.minAmount ?? publicPackage?.minTtoAmount, 100),
      status: "ACTIVE",
      maxDailyRate: round(toNumber(item.maxDailyRate) * 100, 4),
      updatedAt: formatAdminDate(item.updatedAt),
      supportsRateEdit: true,
    } satisfies AdminBondingPackage;
  });

  const packageNameById = new Map(packages.map((item) => [item.packageId, item.name]));
  const activeBondings = bondingItems.map((item) => ({
    id: toString(item.id),
    userWallet: toString(item.walletAddress),
    packageName:
      packageNameById.get(toString(item.packageId)) ??
      toString(item.packageId, "Bonding Package"),
    amount: toNumber(item.principalTto),
    startDate: formatAdminDate(item.startDate, false),
    endDate: formatAdminDate(item.endDate, false),
    status: mapLiveBondingStatus(toString(item.status, "active")),
  }));
  const packageBreakdown = packages.map((item) => ({
    label: item.name,
    value: activeBondings
      .filter((bonding) => bonding.packageName === item.name)
      .reduce((sum, bonding) => sum + bonding.amount, 0),
  }));

  return {
    meta: {
      source: "hybrid",
      notice:
        "Bonding packages and user positions are live. The current admin API only supports rate updates for existing packages, so create/deactivate controls remain mock-only features and are hidden in real mode.",
    },
    packages,
    activeBondings,
    packageBreakdown,
    summary: buildBondingSummary(packages, activeBondings),
    capabilities: {
      createPackage: false,
      togglePackage: false,
      updateRate: true,
    },
  };
}

export async function getAdminTransactionsData(): Promise<AdminTransactionsData> {
  if (USE_MOCK_API) {
    return resolveMock(getAdminTransactionsMockData());
  }

  const [depositsResponse, withdrawalsResponse] = await Promise.all([
    getAdminDeposits(),
    getAdminWithdrawals(),
  ]);

  return {
    meta: {
      source: "hybrid",
      notice:
        "Purchase and withdrawal rows are live. The current admin API does not expose an all-user swap ledger or manual pending-withdrawal approval endpoints, so those features have been removed from real mode.",
    },
    purchases: depositsResponse.map(mapAdminPurchase),
    swaps: [],
    withdrawals: withdrawalsResponse.map(mapAdminWithdrawal),
    capabilities: {
      liveSwaps: false,
      retryFailedWithdrawal: true,
      reviewPendingWithdrawal: false,
    },
  };
}

export async function getAdminTokenData(): Promise<AdminTokenData> {
  if (USE_MOCK_API) {
    return resolveMock(getAdminTokenMockData());
  }

  const config = await getAdminConfig();

  return {
    meta: {
      source: "hybrid",
      notice:
        "The current TTO price is live from admin config. Token metadata and price history remain prototype data because the admin API only exposes the current price configuration.",
    },
    currentPrice: toNumber(config.ttoPriceUsdt, adminTokenData.currentPrice),
    manualOverride: config.useMarketPrice
      ? null
      : toNumber(config.ttoPriceUsdt, adminTokenData.currentPrice),
    tokenName: adminTokenData.tokenName,
    symbol: adminTokenData.symbol,
    description: adminTokenData.description,
    priceHistory: adminTokenData.priceHistory,
    history: adminTokenData.history,
    capabilities: {
      updatePrice: true,
      editMetadata: false,
    },
  };
}

export async function getAdminSettingsData(): Promise<AdminSettingsData> {
  if (USE_MOCK_API) {
    return resolveMock(getAdminSettingsMockData());
  }

  const config = await getAdminConfig();

  return {
    meta: {
      source: "hybrid",
      notice:
        "Swap fee and withdraw network fee are live. Maintenance mode, announcements, and the activity log remain local prototype fields until the admin API exposes them.",
    },
    swapFeePercent: toNumber(config.swapFeePercentage, 1.5),
    flatFeeUsdt: toNumber(config.withdrawNetworkFeeUsdt, adminSettingsData.flatFeeUsdt),
    maintenanceMode: adminSettingsData.maintenanceMode,
    announcement: adminSettingsData.announcement,
    activityLog: adminSettingsData.activityLog,
    capabilities: {
      updateFees: true,
      maintenanceMode: false,
      announcement: false,
    },
  };
}
