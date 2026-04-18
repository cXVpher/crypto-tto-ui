import { fetchApi } from "@/app/_services/api-helpers";
import type {
  ApiRequestOptions,
  AuthChallengeData,
  AuthVerifyResult,
} from "@/app/_types/api-types";

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
