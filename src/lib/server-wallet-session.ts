import "server-only";

import { fetchApi } from "@/lib/fetcher";

export interface WalletSessionSnapshot {
  walletAddress: string;
  username: string;
  balance: number;
  privateBonding: number;
  usdtBalance: number;
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

export async function getWalletSessionSnapshot(
  accessToken: string
): Promise<WalletSessionSnapshot> {
  const auth = { type: "bearer" as const, token: accessToken };
  const [me, balance, bonding] = await Promise.all([
    fetchApi<{
      username?: string;
      walletAddress?: string;
      walletAddressFull?: string;
    }>("/v1/auth/me", {
      auth,
    }),
    fetchApi<{
      ttoBalance?: number;
      usdtBalance?: number;
    }>("/v1/user/balance", {
      auth,
    }),
    fetchApi<{
      totalLockedTto?: number;
    }>("/v1/bonding/active", {
      auth,
    }),
  ]);

  const walletAddress = toString(me.walletAddressFull ?? me.walletAddress);

  return {
    walletAddress,
    username: toString(me.username, walletAddress),
    balance: toNumber(balance.ttoBalance),
    privateBonding: toNumber(bonding.totalLockedTto),
    usdtBalance: toNumber(balance.usdtBalance),
  };
}
