import {
  USE_MOCK_API,
  fetchApi,
  formatDateTime,
  formatLevelLabel,
  formatStatusLabel,
  resolveAuth,
  resolveMock,
  toNumber,
  toString,
} from "@/app/_services/api-helpers";
import { mockReferralTreeResponse } from "@/app/_lib/mock-data";
import type { NetworkData, PaginationOptions } from "@/app/_types/api-types";

type ReferralTreeResponse = {
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
};

export async function getNetworkData(
  options: PaginationOptions = {}
): Promise<NetworkData> {
  const tree: ReferralTreeResponse = USE_MOCK_API
    ? await resolveMock<ReferralTreeResponse>(mockReferralTreeResponse)
    : await fetchApi<ReferralTreeResponse>("/v1/referral/tree", {
        baseURL: options.baseURL,
        auth: resolveAuth(options),
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
