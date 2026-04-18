import { fetchApi } from "@/app/_services/api-helpers";
import type {
  ApiRequestOptions,
  WalletSessionData,
} from "@/app/_types/api-types";

export async function getWalletSessionData(
  options: ApiRequestOptions = {}
): Promise<WalletSessionData> {
  return fetchApi<WalletSessionData>("/api/auth/session", {
    baseURL: options.baseURL ?? "",
  });
}
