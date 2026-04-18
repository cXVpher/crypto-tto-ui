import type {
  AdminActivityItem,
  AdminBondingPackage,
  AdminBondingRecord,
  AdminChartPoint,
  AdminPurchase,
  AdminSwap,
  AdminUser,
  AdminWithdrawal,
} from "@/lib/admin-types";

export const adminUsers: AdminUser[] = [
  {
    id: "usr-01",
    walletAddress: "0x73F1a4a4497c1899b4D2",
    username: "TitanNorth",
    rank: "Titan 7",
    registeredAt: "12 Mar 2026",
    totalBonding: 82000,
    status: "ACTIVE",
    bondingStatus: "RUNNING",
    referrals: 16,
    lastActive: "16 Apr 2026 18:20",
  },
  {
    id: "usr-02",
    walletAddress: "0x18eD7cA03872B1345D7a",
    username: "NovaGrid",
    rank: "Titan 5",
    registeredAt: "28 Feb 2026",
    totalBonding: 46100,
    status: "ACTIVE",
    bondingStatus: "RUNNING",
    referrals: 9,
    lastActive: "16 Apr 2026 17:42",
  },
  {
    id: "usr-03",
    walletAddress: "0x6F12de00b5fD2ACD8841",
    username: "LunarForge",
    rank: "Titan 4",
    registeredAt: "03 Feb 2026",
    totalBonding: 22950,
    status: "REVIEW",
    bondingStatus: "IDLE",
    referrals: 4,
    lastActive: "16 Apr 2026 17:09",
  },
  {
    id: "usr-04",
    walletAddress: "0x50D11fC8c1E45AD6615B",
    username: "HexDelta",
    rank: "Titan 3",
    registeredAt: "20 Jan 2026",
    totalBonding: 17200,
    status: "ACTIVE",
    bondingStatus: "RUNNING",
    referrals: 5,
    lastActive: "16 Apr 2026 16:30",
  },
  {
    id: "usr-05",
    walletAddress: "0x22A8ad2f0955E2d9f140",
    username: "AtlasMint",
    rank: "Titan 6",
    registeredAt: "10 Jan 2026",
    totalBonding: 61500,
    status: "ACTIVE",
    bondingStatus: "RUNNING",
    referrals: 11,
    lastActive: "16 Apr 2026 15:51",
  },
  {
    id: "usr-06",
    walletAddress: "0x9A7314ba8B72A94752c2",
    username: "PulseArc",
    rank: "Titan 2",
    registeredAt: "04 Jan 2026",
    totalBonding: 9300,
    status: "SUSPENDED",
    bondingStatus: "ENDED",
    referrals: 2,
    lastActive: "15 Apr 2026 20:15",
  },
  {
    id: "usr-07",
    walletAddress: "0x3eA6f2d469C861dD4a2B",
    username: "OrbitGlass",
    rank: "Titan 5",
    registeredAt: "27 Dec 2025",
    totalBonding: 38500,
    status: "ACTIVE",
    bondingStatus: "RUNNING",
    referrals: 7,
    lastActive: "15 Apr 2026 18:03",
  },
  {
    id: "usr-08",
    walletAddress: "0x7BB1287fA25E1905D11b",
    username: "VantaCrew",
    rank: "Titan 1",
    registeredAt: "11 Dec 2025",
    totalBonding: 4200,
    status: "ACTIVE",
    bondingStatus: "IDLE",
    referrals: 1,
    lastActive: "15 Apr 2026 11:26",
  },
];

export const adminBondingPackages: AdminBondingPackage[] = [
  {
    id: "pkg-30",
    name: "30 Days Launch",
    durationDays: 30,
    dailyProfitRate: 0.45,
    minAmount: 1000,
    status: "ACTIVE",
  },
  {
    id: "pkg-90",
    name: "90 Days Core",
    durationDays: 90,
    dailyProfitRate: 0.72,
    minAmount: 5000,
    status: "ACTIVE",
  },
  {
    id: "pkg-180",
    name: "180 Days Atlas",
    durationDays: 180,
    dailyProfitRate: 0.96,
    minAmount: 12000,
    status: "ACTIVE",
  },
  {
    id: "pkg-365",
    name: "365 Days Titan",
    durationDays: 365,
    dailyProfitRate: 1.32,
    minAmount: 25000,
    status: "ACTIVE",
  },
  {
    id: "pkg-720",
    name: "720 Days Founders",
    durationDays: 720,
    dailyProfitRate: 1.6,
    minAmount: 50000,
    status: "INACTIVE",
  },
];

export const adminActiveBondings: AdminBondingRecord[] = [
  {
    id: "bond-01",
    userWallet: "0x73F1a4a4497c1899b4D2",
    packageName: "365 Days Titan",
    amount: 45000,
    startDate: "03 Jan 2026",
    endDate: "03 Jan 2027",
    status: "RUNNING",
  },
  {
    id: "bond-02",
    userWallet: "0x18eD7cA03872B1345D7a",
    packageName: "180 Days Atlas",
    amount: 24000,
    startDate: "18 Feb 2026",
    endDate: "17 Aug 2026",
    status: "RUNNING",
  },
  {
    id: "bond-03",
    userWallet: "0x22A8ad2f0955E2d9f140",
    packageName: "365 Days Titan",
    amount: 61500,
    startDate: "10 Jan 2026",
    endDate: "10 Jan 2027",
    status: "RUNNING",
  },
  {
    id: "bond-04",
    userWallet: "0x50D11fC8c1E45AD6615B",
    packageName: "90 Days Core",
    amount: 17200,
    startDate: "25 Mar 2026",
    endDate: "23 Jun 2026",
    status: "RUNNING",
  },
  {
    id: "bond-05",
    userWallet: "0x3eA6f2d469C861dD4a2B",
    packageName: "180 Days Atlas",
    amount: 38500,
    startDate: "02 Apr 2026",
    endDate: "29 Sep 2026",
    status: "RUNNING",
  },
  {
    id: "bond-06",
    userWallet: "0x6F12de00b5fD2ACD8841",
    packageName: "30 Days Launch",
    amount: 9100,
    startDate: "09 Apr 2026",
    endDate: "09 May 2026",
    status: "CANCELLED",
  },
  {
    id: "bond-07",
    userWallet: "0x7BB1287fA25E1905D11b",
    packageName: "30 Days Launch",
    amount: 4200,
    startDate: "11 Mar 2026",
    endDate: "10 Apr 2026",
    status: "MATURED",
  },
];

export const adminPurchases: AdminPurchase[] = [
  {
    id: "pur-01",
    user: "TitanNorth",
    amountUsdt: 2600,
    receivedTto: 13000,
    date: "16 Apr 2026 18:11",
    status: "COMPLETED",
  },
  {
    id: "pur-02",
    user: "AtlasMint",
    amountUsdt: 1800,
    receivedTto: 9000,
    date: "16 Apr 2026 16:54",
    status: "COMPLETED",
  },
  {
    id: "pur-03",
    user: "NovaGrid",
    amountUsdt: 1200,
    receivedTto: 6000,
    date: "16 Apr 2026 14:20",
    status: "VERIFIED",
  },
  {
    id: "pur-04",
    user: "OrbitGlass",
    amountUsdt: 640,
    receivedTto: 3200,
    date: "15 Apr 2026 21:08",
    status: "COMPLETED",
  },
];

export const adminSwaps: AdminSwap[] = [
  {
    id: "swp-01",
    user: "HexDelta",
    fromTto: 9000,
    toUsdt: 1800,
    date: "16 Apr 2026 17:03",
    status: "COMPLETED",
  },
  {
    id: "swp-02",
    user: "TitanNorth",
    fromTto: 2500,
    toUsdt: 500,
    date: "16 Apr 2026 15:15",
    status: "COMPLETED",
  },
  {
    id: "swp-03",
    user: "LunarForge",
    fromTto: 1800,
    toUsdt: 360,
    date: "16 Apr 2026 13:49",
    status: "FAILED",
  },
  {
    id: "swp-04",
    user: "VantaCrew",
    fromTto: 1100,
    toUsdt: 220,
    date: "15 Apr 2026 09:11",
    status: "COMPLETED",
  },
];

export const adminWithdrawals: AdminWithdrawal[] = [
  {
    id: "wd-01",
    user: "NovaGrid",
    amount: 2200,
    wallet: "0x18eD7cA03872B1345D7a",
    fee: 44,
    date: "16 Apr 2026 18:22",
    status: "PROCESSING",
  },
  {
    id: "wd-02",
    user: "AtlasMint",
    amount: 800,
    wallet: "0x22A8ad2f0955E2d9f140",
    fee: 16,
    date: "16 Apr 2026 16:01",
    status: "COMPLETED",
  },
  {
    id: "wd-03",
    user: "PulseArc",
    amount: 400,
    wallet: "0x9A7314ba8B72A94752c2",
    fee: 8,
    date: "15 Apr 2026 19:43",
    status: "COMPLETED",
  },
  {
    id: "wd-04",
    user: "OrbitGlass",
    amount: 1200,
    wallet: "0x3eA6f2d469C861dD4a2B",
    fee: 24,
    date: "15 Apr 2026 10:20",
    status: "FAILED",
  },
];

export const adminRevenueSeries: AdminChartPoint[] = [
  { label: "Apr 05", value: 11200 },
  { label: "Apr 06", value: 12800 },
  { label: "Apr 07", value: 13520 },
  { label: "Apr 08", value: 14110 },
  { label: "Apr 09", value: 15400 },
  { label: "Apr 10", value: 16120 },
  { label: "Apr 11", value: 14950 },
  { label: "Apr 12", value: 17200 },
  { label: "Apr 13", value: 18120 },
  { label: "Apr 14", value: 19440 },
  { label: "Apr 15", value: 20210 },
  { label: "Apr 16", value: 21830 },
];

export const adminUserGrowthSeries: AdminChartPoint[] = [
  { label: "Apr 05", value: 182 },
  { label: "Apr 06", value: 184 },
  { label: "Apr 07", value: 188 },
  { label: "Apr 08", value: 193 },
  { label: "Apr 09", value: 198 },
  { label: "Apr 10", value: 204 },
  { label: "Apr 11", value: 211 },
  { label: "Apr 12", value: 219 },
  { label: "Apr 13", value: 224 },
  { label: "Apr 14", value: 232 },
  { label: "Apr 15", value: 239 },
  { label: "Apr 16", value: 246 },
];

export const adminRecentActivity: AdminActivityItem[] = [
  {
    id: "act-01",
    category: "Withdrawal",
    title: "Pending withdrawal requires approval",
    detail: "NovaGrid requested 2,200 TTO to 0x18eD7cA03872B1345D7a",
    timestamp: "16 Apr 2026 18:22",
    tone: "amber",
  },
  {
    id: "act-02",
    category: "Purchase",
    title: "Large market purchase completed",
    detail: "TitanNorth purchased 13,000 TTO for 2,600 USDT",
    timestamp: "16 Apr 2026 18:11",
    tone: "cyan",
  },
  {
    id: "act-03",
    category: "Bonding",
    title: "Atlas package queued for review",
    detail: "LunarForge submitted a 9,100 TTO launch package",
    timestamp: "16 Apr 2026 17:35",
    tone: "rose",
  },
  {
    id: "act-04",
    category: "Swap",
    title: "High-value swap settled",
    detail: "HexDelta swapped 9,000 TTO into 1,800 USDT",
    timestamp: "16 Apr 2026 17:03",
    tone: "emerald",
  },
];

export const adminTokenData: {
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
} = {
  currentPrice: 0.2,
  manualOverride: 0.208,
  tokenName: "TitanToon",
  symbol: "TTO",
  description:
    "TitanToon is the platform utility token used for bonding, swaps, and wallet-level reward programs.",
  priceHistory: [
    { label: "Apr 05", value: 0.187 },
    { label: "Apr 06", value: 0.188 },
    { label: "Apr 07", value: 0.189 },
    { label: "Apr 08", value: 0.191 },
    { label: "Apr 09", value: 0.192 },
    { label: "Apr 10", value: 0.193 },
    { label: "Apr 11", value: 0.194 },
    { label: "Apr 12", value: 0.196 },
    { label: "Apr 13", value: 0.198 },
    { label: "Apr 14", value: 0.199 },
    { label: "Apr 15", value: 0.2 },
    { label: "Apr 16", value: 0.208 },
  ],
  history: [
    {
      id: "price-04",
      timestamp: "16 Apr 2026 15:10",
      price: 0.208,
      source: "Manual",
    },
    {
      id: "price-03",
      timestamp: "15 Apr 2026 22:05",
      price: 0.2,
      source: "Market",
    },
    {
      id: "price-02",
      timestamp: "14 Apr 2026 18:12",
      price: 0.198,
      source: "Market",
    },
    {
      id: "price-01",
      timestamp: "12 Apr 2026 08:55",
      price: 0.196,
      source: "Manual",
    },
  ],
};

export const adminSettingsData: {
  flatFeeUsdt: number;
  maintenanceMode: boolean;
  announcement: string;
  activityLog: Array<{
    id: string;
    actor: string;
    action: string;
    timestamp: string;
  }>;
} = {
  flatFeeUsdt: 5,
  maintenanceMode: false,
  announcement:
    "Wallet settlements are processing normally. Bonding redemptions above 50k TTO continue through manual review.",
  activityLog: [
    {
      id: "log-01",
      actor: "Admin",
      action: "Adjusted manual TTO price override to 0.208",
      timestamp: "16 Apr 2026 15:10",
    },
    {
      id: "log-02",
      actor: "Admin",
      action: "Approved AtlasMint withdrawal",
      timestamp: "16 Apr 2026 16:02",
    },
    {
      id: "log-03",
      actor: "Admin",
      action: "Reviewed LunarForge bonding submission",
      timestamp: "16 Apr 2026 17:35",
    },
    {
      id: "log-04",
      actor: "Admin",
      action: "Updated announcement banner copy",
      timestamp: "15 Apr 2026 12:20",
    },
  ],
};
