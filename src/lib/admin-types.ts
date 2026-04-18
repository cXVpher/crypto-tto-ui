export type AdminTone = "cyan" | "emerald" | "amber" | "rose";
export type AdminDataSource = "mock" | "live" | "hybrid";

export interface AdminPageMeta {
  source: AdminDataSource;
  notice?: string;
}

export interface AdminChartPoint {
  label: string;
  value: number;
}

export interface AdminMetric {
  label: string;
  value: number;
  change: string;
  detail: string;
  tone: AdminTone;
  format: "compact" | "currency" | "token" | "integer" | "price";
}

export interface AdminActivityItem {
  id: string;
  category: string;
  title: string;
  detail: string;
  timestamp: string;
  tone: AdminTone;
}

export interface AdminOverviewData {
  meta: AdminPageMeta;
  stats: AdminMetric[];
  revenueSeries: AdminChartPoint[];
  userGrowthSeries: AdminChartPoint[];
  recentActivity: AdminActivityItem[];
  spotlight: Array<{
    label: string;
    value: string;
    description: string;
  }>;
}

export interface AdminUser {
  id: string;
  walletAddress: string;
  username: string;
  rank: string;
  registeredAt: string;
  totalBonding: number;
  status: "ACTIVE" | "SUSPENDED" | "REVIEW" | "UNKNOWN";
  bondingStatus: "RUNNING" | "IDLE" | "ENDED";
  referrals: number;
  lastActive: string;
  isAdmin?: boolean;
  ttoBalance?: number;
  ttoLocked?: number;
  usdtBalance?: number;
}

export interface AdminUserContext {
  bondings: AdminBondingRecord[];
  purchases: AdminPurchase[];
  swaps: AdminSwap[];
  withdrawals: AdminWithdrawal[];
}

export interface AdminUsersData {
  meta: AdminPageMeta;
  users: AdminUser[];
  contexts: Record<string, AdminUserContext>;
  capabilities: {
    suspend: boolean;
  };
}

export interface AdminBondingPackage {
  id: string;
  packageId?: string;
  name: string;
  durationDays: number;
  dailyProfitRate: number;
  minAmount: number;
  status: "ACTIVE" | "INACTIVE";
  maxDailyRate?: number;
  updatedAt?: string;
  supportsRateEdit?: boolean;
}

export interface AdminBondingRecord {
  id: string;
  userWallet: string;
  packageName: string;
  amount: number;
  startDate: string;
  endDate: string;
  status: "RUNNING" | "MATURED" | "PENDING" | "CANCELLED";
}

export interface AdminBondingData {
  meta: AdminPageMeta;
  packages: AdminBondingPackage[];
  activeBondings: AdminBondingRecord[];
  packageBreakdown: Array<{
    label: string;
    value: number;
  }>;
  summary: AdminMetric[];
  capabilities: {
    createPackage: boolean;
    togglePackage: boolean;
    updateRate: boolean;
  };
}

export type AdminTransactionStatus =
  | "COMPLETED"
  | "PENDING"
  | "FAILED"
  | "REVIEW"
  | "VERIFIED"
  | "PROCESSING";

export interface AdminPurchase {
  id: string;
  user: string;
  amountUsdt: number;
  receivedTto: number;
  date: string;
  status: AdminTransactionStatus;
  txHash?: string | null;
  phaseName?: string;
}

export interface AdminSwap {
  id: string;
  user: string;
  fromTto: number;
  toUsdt: number;
  date: string;
  status: AdminTransactionStatus;
  txHash?: string | null;
}

export interface AdminWithdrawal {
  id: string;
  user: string;
  amount: number;
  wallet: string;
  fee: number;
  date: string;
  status: AdminTransactionStatus;
  txHash?: string | null;
  netAmount?: number;
}

export interface AdminTransactionsData {
  meta: AdminPageMeta;
  purchases: AdminPurchase[];
  swaps: AdminSwap[];
  withdrawals: AdminWithdrawal[];
  capabilities: {
    liveSwaps: boolean;
    retryFailedWithdrawal: boolean;
    reviewPendingWithdrawal: boolean;
  };
}

export interface AdminTokenData {
  meta: AdminPageMeta;
  currentPrice: number;
  manualOverride: number | null;
  tokenName: string;
  symbol: string;
  description: string;
  priceHistory: AdminChartPoint[];
  history: Array<{
    id: string;
    timestamp: string;
    price: number;
    source: "Market" | "Manual";
  }>;
  capabilities: {
    updatePrice: boolean;
    editMetadata: boolean;
  };
}

export interface AdminSettingsData {
  meta: AdminPageMeta;
  swapFeePercent: number;
  flatFeeUsdt: number;
  maintenanceMode: boolean;
  announcement: string;
  activityLog: Array<{
    id: string;
    actor: string;
    action: string;
    timestamp: string;
  }>;
  capabilities: {
    updateFees: boolean;
    maintenanceMode: boolean;
    announcement: boolean;
  };
}
