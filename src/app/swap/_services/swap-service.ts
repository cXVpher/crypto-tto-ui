import {
  TOKEN_PRICE_USDT,
  TOKEN_SYMBOL,
  USE_MOCK_API,
  fetchApi,
  formatDate,
  formatStatusLabel,
  resolveAuth,
  resolveMock,
  toNumber,
  toString,
} from "@/app/_services/api-helpers";
import { mockSwapHistoryResponse } from "@/app/_lib/mock-data";
import type {
  ApiAuthOptions,
  ApiRequestOptions,
  PaginationOptions,
  SwapExecutionResult,
  SwapHistoryItem,
  SwapQuoteData,
  SwapRateConfig,
} from "@/app/_types/api-types";

type SwapHistoryResponseItem = {
  id?: string | number;
  ttoAmount?: number;
  fromAmount?: number;
  fromToken?: string;
  netUsdt?: number;
  usdtAmount?: number;
  toAmount?: number;
  toToken?: string;
  createdAt?: string;
  completedAt?: string;
  date?: string;
  status?: string;
};

export async function getSwapRateData(
  options: ApiRequestOptions = {}
): Promise<SwapRateConfig> {
  if (USE_MOCK_API) {
    return resolveMock({
      ttoPriceUsdt: TOKEN_PRICE_USDT,
      priceSource: "mock",
      feePercentage: 1,
      minimumTto: 10,
    });
  }

  const rate = await fetchApi<{
    ttoPriceUsdt?: number;
    priceSource?: string;
    feePercentage?: number;
    minimumTto?: number;
  }>("/v1/swap/rate", {
    baseURL: options.baseURL,
  });

  return {
    ttoPriceUsdt: toNumber(rate.ttoPriceUsdt, TOKEN_PRICE_USDT),
    priceSource: toString(rate.priceSource, "market"),
    feePercentage: toNumber(rate.feePercentage, 1),
    minimumTto: toNumber(rate.minimumTto, 10),
  };
}

export async function getSwapQuote(
  ttoAmount: number,
  options: ApiAuthOptions = {}
): Promise<SwapQuoteData> {
  const auth = resolveAuth(options);

  return fetchApi<SwapQuoteData>("/v1/swap/quote", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      ttoAmount,
    },
  });
}

export async function executeSwap(
  ttoAmount: number,
  options: ApiAuthOptions = {}
): Promise<SwapExecutionResult> {
  const auth = resolveAuth(options);

  return fetchApi<SwapExecutionResult>("/v1/swap/execute", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      ttoAmount,
    },
  });
}

export async function getSwapHistoryData(
  options: PaginationOptions = {}
): Promise<SwapHistoryItem[]> {
  const history = USE_MOCK_API
    ? await resolveMock<SwapHistoryResponseItem[]>(mockSwapHistoryResponse)
    : await fetchApi<SwapHistoryResponseItem[]>("/v1/swap/history", {
        baseURL: options.baseURL,
        auth: resolveAuth(options),
        query: {
          page: options.page ?? 1,
          limit: options.limit ?? 10,
        },
      });

  return history.map((item, index) => ({
    id: item.id ?? index + 1,
    fromAmount: toNumber(item.fromAmount ?? item.ttoAmount),
    fromToken: toString(item.fromToken, TOKEN_SYMBOL),
    toAmount: toNumber(item.toAmount ?? item.netUsdt ?? item.usdtAmount),
    toToken: toString(item.toToken, "USDT"),
    date: formatDate(item.completedAt ?? item.date ?? item.createdAt),
    status: formatStatusLabel(item.status, "Completed"),
  }));
}
