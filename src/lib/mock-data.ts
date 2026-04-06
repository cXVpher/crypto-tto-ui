// src/lib/mock-data.ts
export const TOKEN_NAME = "TitanToon";
export const TOKEN_SYMBOL = "TTO";
export const TOKEN_PRICE_USDT = 0.2;

export const bondingPackages = [
  {
    id: 1,
    name: "30 Days Pack",
    days: 30,
    dailyProfit: 0.50,
    minAmount: 1000,
    icon: "🔥",
  },
  {
    id: 2,
    name: "90 Days Pack",
    days: 90,
    dailyProfit: 0.75,
    minAmount: 5000,
    icon: "🔥",
  },
  {
    id: 3,
    name: "180 Days Pack",
    days: 180,
    dailyProfit: 1.0,
    minAmount: 10000,
    icon: "🔥",
  },
  {
    id: 4,
    name: "365 Days Pack",
    days: 365,
    dailyProfit: 1.5,
    minAmount: 25000,
    icon: "🔥",
  },
];

export const myBondingList = [
  {
    id: 1,
    packageName: "365 Days Pack",
    amount: 18000.0,
    token: "TTO",
    status: "RUNNING",
    startDate: "24 Jan 2026",
    endDate: "23 Jan 2027",
  },
  {
    id: 2,
    packageName: "365 Days Pack",
    amount: 35000.0,
    token: "TTO",
    status: "RUNNING",
    startDate: "23 Jan 2026",
    endDate: "22 Jan 2027",
  },
  {
    id: 3,
    packageName: "365 Days Pack",
    amount: 70.6,
    token: "TTO",
    status: "RUNNING",
    startDate: "17 Jan 2026",
    endDate: "16 Jan 2027",
  },
];

export const networkAffiliates = [
  {
    level: 1,
    label: "LV-01",
    wallets: [
      {
        address: "0x473D9e1ea37C161D96cB",
        bonding: 7010.08,
        inviteDate: "03 Dec 2025 — 15:08 UTC",
      },
      {
        address: "0x28307fA99Ab63aa5ddc4",
        bonding: 0.0,
        inviteDate: "11 Dec 2025 — 16:33 UTC",
      },
    ],
  },
  {
    level: 2,
    label: "LV-02",
    wallets: [
      {
        address: "0xBD45b04534e53d4a83",
        bonding: 1064.43,
        inviteDate: "03 Dec 2025 — 04:50 UTC",
      },
      {
        address: "0xa3f16879b38c0d6a7658",
        bonding: 0.0,
        inviteDate: "10 Mar 2026 — 01:04 UTC",
      },
      {
        address: "0xFe86D4e697a7fA673f3D",
        bonding: 700.0,
        inviteDate: "10 Jan 2026 — 03:09 UTC",
      },
    ],
  },
];

export const swapHistory = [
  {
    id: 1,
    fromAmount: 500,
    fromToken: "TTO",
    toAmount: 100,
    toToken: "USDT",
    date: "15 Mar 2026",
    status: "Completed",
  },
  {
    id: 2,
    fromAmount: 1000,
    fromToken: "TTO",
    toAmount: 200,
    toToken: "USDT",
    date: "10 Mar 2026",
    status: "Completed",
  },
];

export const purchaseHistory = [
  {
    id: 1,
    amount: 500,
    token: "USDT",
    received: 2500,
    receivedToken: "TTO",
    date: "20 Mar 2026",
    status: "Completed",
  },
  {
    id: 2,
    amount: 1000,
    token: "USDT",
    received: 5000,
    receivedToken: "TTO",
    date: "15 Mar 2026",
    status: "Completed",
  },
];

export const userProfile = {
  username: "UserCaFA53C098",
  rankLevel: "TITAN 4",
  registeredSince: "01 Dec 2025, 15:58 UTC",
  invitedBy: "0xf3aEF0a9fDf3b2e9053657516e747efd62fD04",
  affiliateLink: "https://titantoon.io/start?ref=",
  version: "v 1.24.03 (Alpha)",
};
