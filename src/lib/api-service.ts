import { fetchApi } from "@/lib/fetcher";
import {
  TOKEN_NAME,
  TOKEN_PRICE_USDT,
  TOKEN_SYMBOL,
  bondingPackages,
  myBondingList,
  networkAffiliates,
  purchaseHistory,
  swapHistory,
  userProfile,
  withdrawHistory,
} from "@/lib/mock-data";

const MOCK_DELAY_MS = 250;
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export interface TokenConfig {
  name: string;
  symbol: string;
  priceUsdt: number;
}

export interface DashboardData {
  token: TokenConfig;
}

export interface BondingPackage {
  id: string | number;
  name: string;
  days: number;
  dailyProfit: number;
  minAmount: number;
  icon: string;
}

export interface BondingItem {
  id: string | number;
  packageName: string;
  amount: number;
  token: string;
  status: string;
  startDate: string;
  endDate: string;
}

export interface BondingData {
  packages: BondingPackage[];
  myBondingList: BondingItem[];
}

export interface NetworkAffiliateWallet {
  address: string;
  bonding: number;
  inviteDate: string;
}

export interface NetworkAffiliateLevel {
  level: number;
  label: string;
  wallets: NetworkAffiliateWallet[];
}

export interface NetworkData {
  affiliates: NetworkAffiliateLevel[];
}

export interface SwapHistoryItem {
  id: string | number;
  fromAmount: number;
  fromToken: string;
  toAmount: number;
  toToken: string;
  date: string;
  status: string;
}

export interface PurchaseHistoryItem {
  id: string | number;
  amount: number;
  token: string;
  received: number;
  receivedToken: string;
  date: string;
  status: string;
}

export interface WithdrawHistoryItem {
  id: string | number;
  amount: number;
  token: string;
  wallet: string;
  fee: number;
  date: string;
  status: string;
}

export interface HistoryData {
  purchaseHistory: PurchaseHistoryItem[];
  withdrawHistory: WithdrawHistoryItem[];
}

export interface ProfileData {
  username: string;
  rankLevel: string;
  registeredSince: string;
  invitedBy: string;
  affiliateLink: string;
  version: string;
}

export interface ApiAuthOptions {
  accessToken?: string;
}

export interface PaginationOptions extends ApiAuthOptions {
  page?: number;
  limit?: number;
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

function requireAccessToken(accessToken?: string) {
  if (!accessToken) {
    throw new Error(
      "An access token is required when NEXT_PUBLIC_USE_MOCK_API=false."
    );
  }

  return accessToken;
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const numericValue = Number(value);
  return Number.isFinite(numericValue) ? numericValue : fallback;
}

function toString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function formatDate(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatDateTime(value: unknown) {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === "string" ? value : "";
  }

  const datePart = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  const timePart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  }).format(date);

  return `${datePart} ${timePart} UTC`;
}

function formatLevelLabel(level: number) {
  return `LV-${String(level).padStart(2, "0")}`;
}

export function getTokenConfig(): TokenConfig {
  return {
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    priceUsdt: TOKEN_PRICE_USDT,
  };
}

export async function getDashboardData(): Promise<DashboardData> {
  if (USE_MOCK_API) {
    return resolveMock({
      token: getTokenConfig(),
    });
  }

  const rate = await fetchApi<{ symbol?: string; price?: number }>("/v1/swap/rate");

  return {
    token: {
      name: TOKEN_NAME,
      symbol: toString(rate.symbol, TOKEN_SYMBOL),
      priceUsdt: toNumber(rate.price, TOKEN_PRICE_USDT),
    },
  };
}

export async function getBondingPackages(): Promise<BondingPackage[]> {
  if (USE_MOCK_API) {
    return resolveMock(bondingPackages as BondingPackage[]);
  }

  const packages = await fetchApi<
    Array<{
      id?: string | number;
      packageId?: string;
      name?: string;
      days?: number;
      durationDays?: number;
      dailyProfit?: number;
      dailyRate?: number;
      minAmount?: number;
      minTtoAmount?: number;
    }>
  >("/v1/bonding/packages");

  return packages.map((item, index) => {
    const fallbackDays = toNumber(item.packageId?.replace(/\D/g, ""), index + 1);
    const days = toNumber(item.days ?? item.durationDays, fallbackDays);

    return {
      id: item.id ?? item.packageId ?? index + 1,
      name: toString(item.name, `${days} Days Pack`),
      days,
      dailyProfit: toNumber(
        item.dailyProfit,
        toNumber(item.dailyRate) > 0 ? toNumber(item.dailyRate) * 100 : 0
      ),
      minAmount: toNumber(item.minAmount ?? item.minTtoAmount),
      icon: "🔥",
    };
  });
}

export async function getMyBondingList(
  options: ApiAuthOptions = {}
): Promise<BondingItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(myBondingList as BondingItem[]);
  }

  const accessToken = requireAccessToken(options.accessToken);
  const activeBondings = await fetchApi<
    Array<{
      id?: string | number;
      packageName?: string;
      packageId?: string;
      packageLabel?: string;
      amount?: number;
      ttoAmount?: number;
      token?: string;
      status?: string;
      startDate?: string;
      startedAt?: string;
      endDate?: string;
      endsAt?: string;
    }>
  >("/v1/bonding/active", {
    auth: { type: "bearer", token: accessToken },
  });

  return activeBondings.map((item, index) => ({
    id: item.id ?? index + 1,
    packageName: toString(
      item.packageName ?? item.packageLabel ?? item.packageId,
      "Bonding Package"
    ),
    amount: toNumber(item.amount ?? item.ttoAmount),
    token: toString(item.token, TOKEN_SYMBOL),
    status: toString(item.status, "RUNNING").toUpperCase(),
    startDate: formatDate(item.startDate ?? item.startedAt),
    endDate: formatDate(item.endDate ?? item.endsAt),
  }));
}

export async function getBondingData(
  options: ApiAuthOptions = {}
): Promise<BondingData> {
  const [packages, activeItems] = await Promise.all([
    getBondingPackages(),
    getMyBondingList(options),
  ]);

  return {
    packages,
    myBondingList: activeItems,
  };
}

export async function getNetworkData(
  options: PaginationOptions = {}
): Promise<NetworkData> {
  if (USE_MOCK_API) {
    return resolveMock({
      affiliates: networkAffiliates as NetworkAffiliateLevel[],
    });
  }

  const accessToken = requireAccessToken(options.accessToken);
  const tree = await fetchApi<
    Array<{
      level?: number;
      label?: string;
      wallets?: Array<{
        address?: string;
        wallet?: string;
        bonding?: number;
        totalBonding?: number;
        inviteDate?: string;
        createdAt?: string;
      }>;
      members?: Array<{
        address?: string;
        wallet?: string;
        bonding?: number;
        totalBonding?: number;
        inviteDate?: string;
        createdAt?: string;
      }>;
    }>
  >("/v1/referral/tree", {
    auth: { type: "bearer", token: accessToken },
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 20,
    },
  });

  return {
    affiliates: tree.map((level, index) => {
      const levelNumber = toNumber(level.level, index + 1);
      const members = level.wallets ?? level.members ?? [];

      return {
        level: levelNumber,
        label: toString(level.label, formatLevelLabel(levelNumber)),
        wallets: members.map((wallet) => ({
          address: toString(wallet.address ?? wallet.wallet),
          bonding: toNumber(wallet.bonding ?? wallet.totalBonding),
          inviteDate: formatDateTime(wallet.inviteDate ?? wallet.createdAt),
        })),
      };
    }),
  };
}

export async function getSwapHistoryData(
  options: PaginationOptions = {}
): Promise<SwapHistoryItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(swapHistory as SwapHistoryItem[]);
  }

  const accessToken = requireAccessToken(options.accessToken);
  const history = await fetchApi<
    Array<{
      id?: string | number;
      ttoAmount?: number;
      fromAmount?: number;
      fromToken?: string;
      usdtAmount?: number;
      toAmount?: number;
      toToken?: string;
      createdAt?: string;
      date?: string;
      status?: string;
    }>
  >("/v1/swap/history", {
    auth: { type: "bearer", token: accessToken },
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    },
  });

  return history.map((item, index) => ({
    id: item.id ?? index + 1,
    fromAmount: toNumber(item.fromAmount ?? item.ttoAmount),
    fromToken: toString(item.fromToken, TOKEN_SYMBOL),
    toAmount: toNumber(item.toAmount ?? item.usdtAmount),
    toToken: toString(item.toToken, "USDT"),
    date: formatDate(item.date ?? item.createdAt),
    status: toString(item.status, "Completed"),
  }));
}

export async function getPurchaseHistoryData(
  options: PaginationOptions = {}
): Promise<PurchaseHistoryItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(purchaseHistory as PurchaseHistoryItem[]);
  }

  const accessToken = requireAccessToken(options.accessToken);
  const history = await fetchApi<
    Array<{
      id?: string | number;
      amount?: number;
      token?: string;
      received?: number;
      receivedAmount?: number;
      receivedToken?: string;
      status?: string;
      createdAt?: string;
      date?: string;
    }>
  >("/v1/user/history", {
    auth: { type: "bearer", token: accessToken },
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    },
  });

  return history.map((item, index) => ({
    id: item.id ?? index + 1,
    amount: toNumber(item.amount),
    token: toString(item.token, "USDT"),
    received: toNumber(item.received ?? item.receivedAmount),
    receivedToken: toString(item.receivedToken, TOKEN_SYMBOL),
    date: formatDate(item.date ?? item.createdAt),
    status: toString(item.status, "Completed"),
  }));
}

export async function getWithdrawHistoryData(
  options: PaginationOptions = {}
): Promise<WithdrawHistoryItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(withdrawHistory as WithdrawHistoryItem[]);
  }

  const accessToken = requireAccessToken(options.accessToken);
  const history = await fetchApi<
    Array<{
      id?: string | number;
      amount?: number;
      usdtAmount?: number;
      token?: string;
      wallet?: string;
      recipientAddress?: string;
      fee?: number;
      feeAmount?: number;
      createdAt?: string;
      date?: string;
      status?: string;
    }>
  >("/v1/withdraw/history", {
    auth: { type: "bearer", token: accessToken },
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    },
  });

  return history.map((item, index) => ({
    id: item.id ?? index + 1,
    amount: toNumber(item.amount ?? item.usdtAmount),
    token: toString(item.token, "USDT"),
    wallet: toString(item.wallet ?? item.recipientAddress),
    fee: toNumber(item.fee ?? item.feeAmount),
    date: formatDate(item.date ?? item.createdAt),
    status: toString(item.status, "Completed"),
  }));
}

export async function getHistoryData(
  options: PaginationOptions = {}
): Promise<HistoryData> {
  const [purchaseItems, withdrawItems] = await Promise.all([
    getPurchaseHistoryData(options),
    getWithdrawHistoryData(options),
  ]);

  return {
    purchaseHistory: purchaseItems,
    withdrawHistory: withdrawItems,
  };
}

export async function getProfileData(
  options: ApiAuthOptions = {}
): Promise<ProfileData> {
  if (USE_MOCK_API) {
    return resolveMock(userProfile as ProfileData);
  }

  const accessToken = requireAccessToken(options.accessToken);
  const [me, referralCode, titanStatus] = await Promise.all([
    fetchApi<{
      username?: string;
      wallet?: string;
      createdAt?: string;
      referredBy?: string;
      referredByWallet?: string;
    }>("/v1/auth/me", {
      auth: { type: "bearer", token: accessToken },
    }),
    fetchApi<{
      affiliateLink?: string;
    }>("/v1/referral/code", {
      auth: { type: "bearer", token: accessToken },
    }),
    fetchApi<{
      levelName?: string;
      currentLevelName?: string;
      currentLevel?: number;
    }>("/v1/titan/status", {
      auth: { type: "bearer", token: accessToken },
    }),
  ]);

  const fallbackWallet = toString(me.wallet);

  return {
    username: toString(me.username, fallbackWallet || userProfile.username),
    rankLevel: toString(
      titanStatus.currentLevelName ?? titanStatus.levelName,
      typeof titanStatus.currentLevel === "number"
        ? `TITAN ${titanStatus.currentLevel}`
        : userProfile.rankLevel
    ),
    registeredSince: formatDateTime(me.createdAt) || userProfile.registeredSince,
    invitedBy: toString(me.referredByWallet ?? me.referredBy, userProfile.invitedBy),
    affiliateLink: toString(referralCode.affiliateLink, userProfile.affiliateLink),
    version: userProfile.version,
  };
}
