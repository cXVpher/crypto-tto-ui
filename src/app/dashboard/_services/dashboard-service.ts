import {
  TOKEN_NAME,
  TOKEN_SYMBOL,
  USE_MOCK_API,
  getTokenConfig,
} from "@/app/_services/api-helpers";
import { getSwapRateData } from "@/app/swap/_services/swap-service";
import type {
  ApiRequestOptions,
  DashboardData,
} from "@/app/_types/api-types";

export async function getDashboardData(
  options: ApiRequestOptions = {}
): Promise<DashboardData> {
  if (USE_MOCK_API) {
    return {
      token: getTokenConfig(),
    };
  }

  const rate = await getSwapRateData(options);

  return {
    token: {
      name: TOKEN_NAME,
      symbol: TOKEN_SYMBOL,
      priceUsdt: rate.ttoPriceUsdt,
    },
  };
}
