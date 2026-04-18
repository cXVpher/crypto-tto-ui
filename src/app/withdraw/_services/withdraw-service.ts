import {
  USE_MOCK_API,
  fetchApi,
  formatDate,
  formatStatusLabel,
  resolveAuth,
  resolveMock,
  toNumber,
  toString,
} from "@/app/_services/api-helpers";
import { withdrawHistory } from "@/app/_lib/mock-data";
import type {
  ApiAuthOptions,
  PaginationOptions,
  WithdrawHistoryItem,
  WithdrawQuoteData,
  WithdrawSubmissionResult,
} from "@/app/_types/api-types";

export async function getWithdrawQuote(
  amount: number,
  options: ApiAuthOptions = {}
): Promise<WithdrawQuoteData> {
  const auth = resolveAuth(options);

  return fetchApi<WithdrawQuoteData>("/v1/withdraw/quote", {
    baseURL: options.baseURL,
    auth,
    query: {
      amount,
    },
  });
}

export async function submitWithdraw(
  usdtAmount: number,
  recipientAddress: string,
  options: ApiAuthOptions = {}
): Promise<WithdrawSubmissionResult> {
  const auth = resolveAuth(options);

  return fetchApi<WithdrawSubmissionResult>("/v1/withdraw/submit", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      usdtAmount,
      recipientAddress,
    },
  });
}

export async function getWithdrawHistoryData(
  options: PaginationOptions = {}
): Promise<WithdrawHistoryItem[]> {
  if (USE_MOCK_API) {
    return resolveMock(withdrawHistory as WithdrawHistoryItem[]);
  }

  const auth = resolveAuth(options);
  const history = await fetchApi<
    Array<{
      id?: string | number;
      amount?: number;
      usdtAmount?: number;
      token?: string;
      wallet?: string;
      recipientAddress?: string;
      fee?: number;
      feeAmount?: number;
      networkFeeUsdt?: number;
      createdAt?: string;
      completedAt?: string;
      date?: string;
      status?: string;
    }>
  >("/v1/withdraw/history", {
    baseURL: options.baseURL,
    auth,
    query: {
      page: options.page ?? 1,
      limit: options.limit ?? 10,
    },
  });

  return history.map((item, index) => ({
    id: item.id ?? index + 1,
    amount: toNumber(item.amount ?? item.usdtAmount),
    token: toString(item.token, "USDT"),
    wallet: toString(item.wallet ?? item.recipientAddress),
    fee: toNumber(item.fee ?? item.feeAmount ?? item.networkFeeUsdt),
    date: formatDate(item.completedAt ?? item.date ?? item.createdAt),
    status: formatStatusLabel(item.status, "Processing"),
  }));
}
