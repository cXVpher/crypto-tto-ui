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

export const BROWSER_API_PROXY_BASE_URL = "/api/backend";

export interface ApiRequestOptions {
  baseURL?: string;
}

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
  bonusTto: number;
  inviteDate: string;
  status: string;
}

export interface NetworkAffiliateLevel {
  level: number;
  label: string;
  wallets: NetworkAffiliateWallet[];
}

export interface NetworkData {
  affiliates: NetworkAffiliateLevel[];
}

export interface SwapRateConfig {
  ttoPriceUsdt: number;
  priceSource: string;
  feePercentage: number;
  minimumTto: number;
}

export interface SwapQuoteData extends SwapRateConfig {
  ttoAmount: number;
  grossUsdt: number;
  feeTto: number;
  feeUsdt: number;
  netUsdt: number;
}

export interface SwapExecutionResult {
  swapId: string;
  ttoAmount: number;
  feeTto: number;
  netUsdt: number;
  newUsdtBalance: number;
  status: string;
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

export interface DepositPriceData {
  ttoPriceUsdt: number;
  priceSource: string;
}

export interface DepositQuoteData extends DepositPriceData {
  phaseId: string;
  usdtAmount: number;
  ttoReceive: number;
  remainingAllocationTto: number;
}

export interface DepositConfirmationResult {
  depositId: string;
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

export interface WithdrawQuoteData {
  requestedUsdt: number;
  networkFeeUsdt: number;
  youReceiveUsdt: number;
  recipientAddress: string;
}

export interface WithdrawSubmissionResult {
  withdrawId: string;
  usdtAmount: number;
  networkFeeUsdt: number;
  netUsdt: number;
  recipientAddress: string;
  status: string;
  message: string;
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

export interface WalletSessionData {
  walletAddress: string;
  username: string;
  balance: number;
  privateBonding: number;
  usdtBalance: number;
}

export interface AuthChallengeData {
  challenge: string;
  expiresAt: string;
}

export interface AuthVerifyResult {
  accessToken: string;
  wallet: string;
  expiresIn: number;
  isNewUser: boolean;
}

export interface BondingStartResult {
  bondingId: string;
  packageId: string;
  packageLabel: string;
  principalTto: number;
  dailyRate: number;
  dailyProfitTto: number;
  durationDays: number;
  startDate: string;
  endDate: string;
  totalProjectedProfit: number;
}

export interface ApiAuthOptions extends ApiRequestOptions {
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

function canUseProxyAuth(baseURL?: string) {
  return typeof baseURL === "string" && baseURL.startsWith("/");
}

function resolveAuth(options: ApiAuthOptions = {}) {
  if (options.accessToken) {
    return {
      type: "bearer" as const,
      token: options.accessToken,
    };
  }

  if (canUseProxyAuth(options.baseURL)) {
    return undefined;
  }

  throw new Error(
    "An access token is required when NEXT_PUBLIC_USE_MOCK_API=false."
  );
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

function formatStatusLabel(value: unknown, fallback = "Pending") {
  const status = toString(value, fallback)
    .replace(/[_-]+/g, " ")
    .trim()
    .toLowerCase();

  if (!status) {
    return fallback;
  }

  return status.replace(/\b\w/g, (character) => character.toUpperCase());
}

export function getTokenConfig(): TokenConfig {
  return {
    name: TOKEN_NAME,
    symbol: TOKEN_SYMBOL,
    priceUsdt: TOKEN_PRICE_USDT,
  };
}

export async function getSwapRateData(
  options: ApiRequestOptions = {}
): Promise<SwapRateConfig> {
  if (USE_MOCK_API) {
    return resolveMock({
      ttoPriceUsdt: TOKEN_PRICE_USDT,
      priceSource: "mock",
      feePercentage: 1,
      minimumTto: 10,
    });
  }

  const rate = await fetchApi<{
    ttoPriceUsdt?: number;
    priceSource?: string;
    feePercentage?: number;
    minimumTto?: number;
  }>("/v1/swap/rate", {
    baseURL: options.baseURL,
  });

  return {
    ttoPriceUsdt: toNumber(rate.ttoPriceUsdt, TOKEN_PRICE_USDT),
    priceSource: toString(rate.priceSource, "market"),
    feePercentage: toNumber(rate.feePercentage, 1),
    minimumTto: toNumber(rate.minimumTto, 10),
  };
}

export async function getDashboardData(
  options: ApiRequestOptions = {}
): Promise<DashboardData> {
  if (USE_MOCK_API) {
    return resolveMock({
      token: getTokenConfig(),
    });
  }

  const rate = await getSwapRateData(options);

  return {
    token: {
      name: TOKEN_NAME,
      symbol: TOKEN_SYMBOL,
      priceUsdt: rate.ttoPriceUsdt,
    },
  };
}

export async function getBondingPackages(
  options: ApiRequestOptions = {}
): Promise<BondingPackage[]> {
  if (USE_MOCK_API) {
    return resolveMock(bondingPackages as BondingPackage[]);
  }

  const packages = await fetchApi<
    Array<{
      id?: string | number;
      packageId?: string;
      label?: string;
      name?: string;
      days?: number;
      durationDays?: number;
      dailyProfit?: number;
      dailyRate?: number;
      minAmount?: number;
      minTtoAmount?: number;
    }>
  >("/v1/bonding/packages", {
    baseURL: options.baseURL,
  });

  return packages.map((item, index) => {
    const fallbackDays = toNumber(item.packageId?.replace(/\D/g, ""), index + 1);
    const days = toNumber(item.days ?? item.durationDays, fallbackDays);
    const dailyRate = toNumber(item.dailyRate);

    return {
      id: item.id ?? item.packageId ?? index + 1,
      name: toString(item.name ?? item.label, `${days} Days Pack`),
      days,
      dailyProfit: toNumber(item.dailyProfit, dailyRate > 0 ? dailyRate * 100 : 0),
      minAmount: toNumber(item.minAmount ?? item.minTtoAmount, 100),
      icon: "fire",
    };
  });
}

export async function getMyBondingList(
  options: PaginationOptions = {}
): Promise<BondingItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(myBondingList as BondingItem[]);
  }

  const auth = resolveAuth(options);
  const bondingHistory = await fetchApi<
    Array<{
      id?: string | number;
      packageLabel?: string;
      packageName?: string;
      packageId?: string;
      principalTto?: number;
      amount?: number;
      ttoAmount?: number;
      status?: string;
      startDate?: string;
      startedAt?: string;
      endDate?: string;
      endsAt?: string;
    }>
  >("/v1/bonding/history", {
    baseURL: options.baseURL,
    auth,
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 100,
    },
  });

  return bondingHistory
    .filter((item) => toString(item.status).toUpperCase() === "RUNNING")
    .map((item, index) => ({
      id: item.id ?? index + 1,
      packageName: toString(
        item.packageName ?? item.packageLabel ?? item.packageId,
        "Bonding Package"
      ),
      amount: toNumber(item.amount ?? item.principalTto ?? item.ttoAmount),
      token: TOKEN_SYMBOL,
      status: formatStatusLabel(item.status, "Running"),
      startDate: formatDate(item.startDate ?? item.startedAt),
      endDate: formatDate(item.endDate ?? item.endsAt),
    }));
}

export async function startBonding(
  packageId: string,
  ttoAmount: number,
  options: ApiAuthOptions = {}
): Promise<BondingStartResult> {
  const auth = resolveAuth(options);

  return fetchApi<BondingStartResult>("/v1/bonding/start", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      packageId,
      ttoAmount,
    },
  });
}

export async function getBondingData(
  options: PaginationOptions = {}
): Promise<BondingData> {
  const [packages, activeItems] = await Promise.all([
    getBondingPackages(options),
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

  const auth = resolveAuth(options);
  const tree = await fetchApi<{
    levels?: Array<{
      level?: number;
      label?: string;
      members?: Array<{
        walletAddress?: string;
        inviteDate?: string;
        ttoBonus?: number;
        status?: string;
      }>;
      wallets?: Array<{
        address?: string;
        inviteDate?: string;
        ttoBonus?: number;
        status?: string;
      }>;
    }>;
  }>("/v1/referral/tree", {
    baseURL: options.baseURL,
    auth,
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 20,
    },
  });

  const levels = tree.levels ?? [];

  return {
    affiliates: levels.map((level, index) => {
      const levelNumber = toNumber(level.level, index + 1);
      const members = level.members ?? level.wallets ?? [];

      return {
        level: levelNumber,
        label: toString(level.label, formatLevelLabel(levelNumber)),
        wallets: members.map((wallet) => ({
          address: toString(
            (wallet as { walletAddress?: string }).walletAddress ??
              (wallet as { address?: string }).address
          ),
          bonusTto: toNumber(wallet.ttoBonus),
          inviteDate: formatDateTime(wallet.inviteDate),
          status: formatStatusLabel(wallet.status, "Not Bonding"),
        })),
      };
    }),
  };
}

export async function getSwapQuote(
  ttoAmount: number,
  options: ApiAuthOptions = {}
): Promise<SwapQuoteData> {
  const auth = resolveAuth(options);

  return fetchApi<SwapQuoteData>("/v1/swap/quote", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      ttoAmount,
    },
  });
}

export async function executeSwap(
  ttoAmount: number,
  options: ApiAuthOptions = {}
): Promise<SwapExecutionResult> {
  const auth = resolveAuth(options);

  return fetchApi<SwapExecutionResult>("/v1/swap/execute", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      ttoAmount,
    },
  });
}

export async function getSwapHistoryData(
  options: PaginationOptions = {}
): Promise<SwapHistoryItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(swapHistory as SwapHistoryItem[]);
  }

  const auth = resolveAuth(options);
  const history = await fetchApi<
    Array<{
      id?: string | number;
      ttoAmount?: number;
      fromAmount?: number;
      fromToken?: string;
      netUsdt?: number;
      usdtAmount?: number;
      toAmount?: number;
      toToken?: string;
      createdAt?: string;
      completedAt?: string;
      date?: string;
      status?: string;
    }>
  >("/v1/swap/history", {
    baseURL: options.baseURL,
    auth,
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    },
  });

  return history.map((item, index) => ({
    id: item.id ?? index + 1,
    fromAmount: toNumber(item.fromAmount ?? item.ttoAmount),
    fromToken: toString(item.fromToken, TOKEN_SYMBOL),
    toAmount: toNumber(item.toAmount ?? item.netUsdt ?? item.usdtAmount),
    toToken: toString(item.toToken, "USDT"),
    date: formatDate(item.completedAt ?? item.date ?? item.createdAt),
    status: formatStatusLabel(item.status, "Completed"),
  }));
}

export async function getDepositPriceData(
  options: ApiRequestOptions = {}
): Promise<DepositPriceData> {
  if (USE_MOCK_API) {
    return resolveMock({
      ttoPriceUsdt: TOKEN_PRICE_USDT,
      priceSource: "mock",
    });
  }

  const price = await fetchApi<{
    price?: number;
    source?: string;
  }>("/v1/deposit/price", {
    baseURL: options.baseURL,
  });

  return {
    ttoPriceUsdt: toNumber(price.price, TOKEN_PRICE_USDT),
    priceSource: toString(price.source, "market"),
  };
}

export async function getDepositQuote(
  usdtAmount: number,
  options: ApiAuthOptions = {}
): Promise<DepositQuoteData> {
  const auth = resolveAuth(options);

  return fetchApi<DepositQuoteData>("/v1/deposit/quote", {
    baseURL: options.baseURL,
    auth,
    query: {
      usdtAmount,
    },
  });
}

export async function confirmDeposit(
  txHashPayment: string,
  walletFrom: string,
  usdtAmount: number,
  options: ApiAuthOptions = {}
): Promise<DepositConfirmationResult> {
  const auth = resolveAuth(options);

  return fetchApi<DepositConfirmationResult>("/v1/deposit/confirm", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      txHashPayment,
      walletFrom,
      usdtAmount,
    },
  });
}

export async function getPurchaseHistoryData(
  options: PaginationOptions = {}
): Promise<PurchaseHistoryItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(purchaseHistory as PurchaseHistoryItem[]);
  }

  const auth = resolveAuth(options);
  const history = await fetchApi<
    Array<{
      id?: string | number;
      usdtAmount?: number;
      amount?: number;
      ttoAmount?: number;
      received?: number;
      receivedAmount?: number;
      token?: string;
      receivedToken?: string;
      status?: string;
      createdAt?: string;
      verifiedAt?: string;
      completedAt?: string;
      date?: string;
    }>
  >("/v1/deposit/history", {
    baseURL: options.baseURL,
    auth,
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    },
  });

  return history.map((item, index) => ({
    id: item.id ?? index + 1,
    amount: toNumber(item.amount ?? item.usdtAmount),
    token: toString(item.token, "USDT"),
    received: toNumber(item.received ?? item.receivedAmount ?? item.ttoAmount),
    receivedToken: toString(item.receivedToken, TOKEN_SYMBOL),
    date: formatDate(item.completedAt ?? item.verifiedAt ?? item.date ?? item.createdAt),
    status: formatStatusLabel(item.status, "Pending"),
  }));
}

export async function getWithdrawQuote(
  amount: number,
  options: ApiAuthOptions = {}
): Promise<WithdrawQuoteData> {
  const auth = resolveAuth(options);

  return fetchApi<WithdrawQuoteData>("/v1/withdraw/quote", {
    baseURL: options.baseURL,
    auth,
    query: {
      amount,
    },
  });
}

export async function submitWithdraw(
  usdtAmount: number,
  recipientAddress: string,
  options: ApiAuthOptions = {}
): Promise<WithdrawSubmissionResult> {
  const auth = resolveAuth(options);

  return fetchApi<WithdrawSubmissionResult>("/v1/withdraw/submit", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      usdtAmount,
      recipientAddress,
    },
  });
}

export async function getWithdrawHistoryData(
  options: PaginationOptions = {}
): Promise<WithdrawHistoryItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(withdrawHistory as WithdrawHistoryItem[]);
  }

  const auth = resolveAuth(options);
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
      networkFeeUsdt?: number;
      createdAt?: string;
      completedAt?: string;
      date?: string;
      status?: string;
    }>
  >("/v1/withdraw/history", {
    baseURL: options.baseURL,
    auth,
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
    fee: toNumber(item.fee ?? item.feeAmount ?? item.networkFeeUsdt),
    date: formatDate(item.completedAt ?? item.date ?? item.createdAt),
    status: formatStatusLabel(item.status, "Processing"),
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

  const auth = resolveAuth(options);
  const [me, titanStatus] = await Promise.all([
    fetchApi<{
      username?: string;
      walletAddress?: string;
      walletAddressFull?: string;
      registeredSince?: string;
      invitedByAddress?: string;
      affiliateLink?: string;
    }>("/v1/auth/me", {
      baseURL: options.baseURL,
      auth,
    }),
    fetchApi<{
      currentLevelLabel?: string;
      currentLevel?: number;
    }>("/v1/titan/status", {
      baseURL: options.baseURL,
      auth,
    }),
  ]);

  const fallbackWallet = toString(me.walletAddressFull ?? me.walletAddress);

  return {
    username: toString(me.username, fallbackWallet || userProfile.username),
    rankLevel: toString(
      titanStatus.currentLevelLabel,
      typeof titanStatus.currentLevel === "number"
        ? `Titan ${titanStatus.currentLevel}`
        : userProfile.rankLevel
    ),
    registeredSince:
      formatDateTime(me.registeredSince) || userProfile.registeredSince,
    invitedBy: toString(me.invitedByAddress, userProfile.invitedBy),
    affiliateLink: toString(me.affiliateLink, userProfile.affiliateLink),
    version: userProfile.version,
  };
}

export async function getAuthChallenge(
  wallet: string,
  options: ApiRequestOptions = {}
): Promise<AuthChallengeData> {
  return fetchApi<AuthChallengeData>("/v1/auth/challenge", {
    baseURL: options.baseURL,
    query: {
      wallet,
    },
  });
}

export async function verifyAuthSignature(
  input: {
    wallet: string;
    signature: string;
    challenge: string;
    referralCode?: string;
  },
  options: ApiRequestOptions = {}
): Promise<AuthVerifyResult> {
  return fetchApi<AuthVerifyResult>("/v1/auth/verify", {
    baseURL: options.baseURL,
    method: "POST",
    body: input,
  });
}

export async function getWalletSessionData(
  options: ApiRequestOptions = {}
): Promise<WalletSessionData> {
  return fetchApi<WalletSessionData>("/api/auth/session", {
    baseURL: options.baseURL ?? "",
  });
}
