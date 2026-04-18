import {
  USE_MOCK_API,
  fetchApi,
  formatDateTime,
  resolveAuth,
  resolveMock,
  toString,
} from "@/app/_services/api-helpers";
import { userProfile } from "@/app/_lib/mock-data";
import type { ApiAuthOptions, ProfileData } from "@/app/_types/api-types";

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
