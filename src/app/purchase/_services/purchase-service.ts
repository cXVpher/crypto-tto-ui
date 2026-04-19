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
import { mockDepositHistoryResponse } from "@/app/_lib/mock-data";
import type {
  ApiAuthOptions,
  ApiRequestOptions,
  DepositConfirmationResult,
  DepositPriceData,
  DepositQuoteData,
  PaginationOptions,
  PurchaseHistoryItem,
} from "@/app/_types/api-types";

type DepositHistoryResponseItem = {
  id?: string | number;
  usdtAmount?: number;
  amount?: number;
  ttoAmount?: number;
  received?: number;
  receivedAmount?: number;
  token?: string;
  receivedToken?: string;
  status?: string;
  createdAt?: string;
  verifiedAt?: string;
  completedAt?: string;
  date?: string;
};

export async function getDepositPriceData(
  options: ApiRequestOptions = {}
): Promise<DepositPriceData> {
  if (USE_MOCK_API) {
    return resolveMock({
      ttoPriceUsdt: TOKEN_PRICE_USDT,
      priceSource: "mock",
    });
  }

  const price = await fetchApi<{
    price?: number;
    source?: string;
  }>("/v1/deposit/price", {
    baseURL: options.baseURL,
  });

  return {
    ttoPriceUsdt: toNumber(price.price, TOKEN_PRICE_USDT),
    priceSource: toString(price.source, "market"),
  };
}

export async function getDepositQuote(
  usdtAmount: number,
  options: ApiAuthOptions = {}
): Promise<DepositQuoteData> {
  const auth = resolveAuth(options);

  return fetchApi<DepositQuoteData>("/v1/deposit/quote", {
    baseURL: options.baseURL,
    auth,
    query: {
      usdtAmount,
    },
  });
}

export async function confirmDeposit(
  txHashPayment: string,
  walletFrom: string,
  usdtAmount: number,
  options: ApiAuthOptions = {}
): Promise<DepositConfirmationResult> {
  const auth = resolveAuth(options);

  return fetchApi<DepositConfirmationResult>("/v1/deposit/confirm", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      txHashPayment,
      walletFrom,
      usdtAmount,
    },
  });
}

export async function getPurchaseHistoryData(
  options: PaginationOptions = {}
): Promise<PurchaseHistoryItem[]> {
  const history = USE_MOCK_API
    ? await resolveMock<DepositHistoryResponseItem[]>(mockDepositHistoryResponse)
    : await fetchApi<DepositHistoryResponseItem[]>("/v1/deposit/history", {
        baseURL: options.baseURL,
        auth: resolveAuth(options),
        query: {
          page: options.page ?? 1,
          limit: options.limit ?? 10,
        },
      });

  return history.map((item, index) => ({
    id: item.id ?? index + 1,
    amount: toNumber(item.amount ?? item.usdtAmount),
    token: toString(item.token, "USDT"),
    received: toNumber(item.received ?? item.receivedAmount ?? item.ttoAmount),
    receivedToken: toString(item.receivedToken, TOKEN_SYMBOL),
    date: formatDate(item.completedAt ?? item.verifiedAt ?? item.date ?? item.createdAt),
    status: formatStatusLabel(item.status, "Pending"),
  }));
}
