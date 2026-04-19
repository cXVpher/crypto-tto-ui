export const TOKEN_NAME = "TitanToon";
export const TOKEN_SYMBOL = "TTO";
export const TOKEN_PRICE_USDT = 0.2;

export const mockBondingPackagesResponse = [
  {
    id: "pkg-30",
    packageId: "pkg-30",
    label: "30 Days Launch",
    durationDays: 30,
    dailyRate: 0.0045,
    minTtoAmount: 100,
  },
  {
    id: "pkg-90",
    packageId: "pkg-90",
    label: "90 Days Core",
    durationDays: 90,
    dailyRate: 0.0072,
    minTtoAmount: 100,
  },
  {
    id: "pkg-180",
    packageId: "pkg-180",
    label: "180 Days Atlas",
    durationDays: 180,
    dailyRate: 0.0096,
    minTtoAmount: 100,
  },
  {
    id: "pkg-365",
    packageId: "pkg-365",
    label: "365 Days Titan",
    durationDays: 365,
    dailyRate: 0.0132,
    minTtoAmount: 100,
  },
];

export const mockBondingHistoryResponse = [
  {
    id: "bond-01",
    packageId: "pkg-365",
    packageLabel: "365 Days Titan",
    principalTto: 18000,
    status: "running",
    startDate: "2026-01-24T00:00:00.000Z",
    endDate: "2027-01-23T00:00:00.000Z",
  },
  {
    id: "bond-02",
    packageId: "pkg-365",
    packageLabel: "365 Days Titan",
    principalTto: 35000,
    status: "running",
    startDate: "2026-01-23T00:00:00.000Z",
    endDate: "2027-01-22T00:00:00.000Z",
  },
  {
    id: "bond-03",
    packageId: "pkg-90",
    packageLabel: "90 Days Core",
    principalTto: 70.6,
    status: "running",
    startDate: "2026-01-17T00:00:00.000Z",
    endDate: "2026-04-17T00:00:00.000Z",
  },
];

export const mockReferralTreeResponse = {
  levels: [
    {
      level: 1,
      label: "LV-01",
      members: [
        {
          walletAddress: "0x473D9e1ea37C161D96cB",
          ttoBonus: 7010.08,
          inviteDate: "2025-12-03T15:08:00.000Z",
          status: "bonding",
        },
        {
          walletAddress: "0x28307fA99Ab63aa5ddc4",
          ttoBonus: 0,
          inviteDate: "2025-12-11T16:33:00.000Z",
          status: "not_bonding",
        },
      ],
    },
    {
      level: 2,
      label: "LV-02",
      members: [
        {
          walletAddress: "0xBD45b04534e53d4a83",
          ttoBonus: 1064.43,
          inviteDate: "2025-12-03T04:50:00.000Z",
          status: "bonding",
        },
        {
          walletAddress: "0xa3f16879b38c0d6a7658",
          ttoBonus: 0,
          inviteDate: "2026-03-10T01:04:00.000Z",
          status: "not_bonding",
        },
        {
          walletAddress: "0xFe86D4e697a7fA673f3D",
          ttoBonus: 700,
          inviteDate: "2026-01-10T03:09:00.000Z",
          status: "bonding",
        },
      ],
    },
  ],
};

export const mockSwapHistoryResponse = [
  {
    id: "swap-01",
    ttoAmount: 500,
    netUsdt: 99,
    completedAt: "2026-03-15T00:00:00.000Z",
    status: "completed",
  },
  {
    id: "swap-02",
    ttoAmount: 1000,
    netUsdt: 198,
    completedAt: "2026-03-10T00:00:00.000Z",
    status: "completed",
  },
];

export const mockDepositHistoryResponse = [
  {
    id: "dep-01",
    usdtAmount: 500,
    ttoAmount: 2500,
    completedAt: "2026-03-20T00:00:00.000Z",
    status: "completed",
  },
  {
    id: "dep-02",
    usdtAmount: 1000,
    ttoAmount: 5000,
    completedAt: "2026-03-15T00:00:00.000Z",
    status: "completed",
  },
];

export const mockWithdrawHistoryResponse = [
  {
    id: "wd-01",
    usdtAmount: 1200,
    recipientAddress: "0x473D9e1ea37C161D96cB",
    networkFeeUsdt: 0.5,
    completedAt: "2026-03-26T00:00:00.000Z",
    status: "completed",
  },
  {
    id: "wd-02",
    usdtAmount: 500,
    recipientAddress: "0xBD45b04534e53d4a83",
    networkFeeUsdt: 0.5,
    createdAt: "2026-03-18T00:00:00.000Z",
    status: "processing",
  },
];

export const mockAuthMeResponse = {
  username: "UserCaFA53C098",
  walletAddress: "0xCaFA53C098B1d7a51234",
  registeredSince: "2025-12-01T15:58:00.000Z",
  invitedByAddress: "0xf3aEF0...D04",
  affiliateLink: "https://titantoon.io/start?ref=TTO-C4FA53",
};

export const mockTitanStatusResponse = {
  currentLevel: 4,
  currentLevelLabel: "Titan 4",
};

export const userProfile = {
  username: mockAuthMeResponse.username,
  rankLevel: mockTitanStatusResponse.currentLevelLabel,
  registeredSince: "01 Dec 2025 15:58 UTC",
  invitedBy: mockAuthMeResponse.invitedByAddress,
  affiliateLink: mockAuthMeResponse.affiliateLink,
  version: "v 1.24.03 (Alpha)",
};
