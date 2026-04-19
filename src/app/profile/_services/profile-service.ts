import {
  USE_MOCK_API,
  fetchApi,
  formatDateTime,
  resolveAuth,
  resolveMock,
  toString,
} from "@/app/_services/api-helpers";
import {
  mockAuthMeResponse,
  mockTitanStatusResponse,
  userProfile,
} from "@/app/_lib/mock-data";
import type { ApiAuthOptions, ProfileData } from "@/app/_types/api-types";

type AuthMeResponse = {
  username?: string;
  walletAddress?: string;
  walletAddressFull?: string;
  registeredSince?: string;
  invitedByAddress?: string;
  affiliateLink?: string;
};

type TitanStatusResponse = {
  currentLevelLabel?: string;
  currentLevel?: number;
};

export async function getProfileData(
  options: ApiAuthOptions = {}
): Promise<ProfileData> {
  const [me, titanStatus] = USE_MOCK_API
    ? await Promise.all([
        resolveMock<AuthMeResponse>(mockAuthMeResponse),
        resolveMock<TitanStatusResponse>(mockTitanStatusResponse),
      ])
    : await Promise.all([
        fetchApi<AuthMeResponse>("/v1/auth/me", {
          baseURL: options.baseURL,
          auth: resolveAuth(options),
        }),
        fetchApi<TitanStatusResponse>("/v1/titan/status", {
          baseURL: options.baseURL,
          auth: resolveAuth(options),
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
