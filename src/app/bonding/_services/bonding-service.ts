import {
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
import {
  mockBondingHistoryResponse,
  mockBondingPackagesResponse,
} from "@/app/_lib/mock-data";
import type {
  ApiAuthOptions,
  ApiRequestOptions,
  BondingData,
  BondingItem,
  BondingPackage,
  BondingStartResult,
  PaginationOptions,
} from "@/app/_types/api-types";

export async function getBondingPackages(
  options: ApiRequestOptions = {}
): Promise<BondingPackage[]> {
  const mapPackage = (
    item: {
      id?: string | number;
      packageId?: string;
      label?: string;
      name?: string;
      days?: number;
      durationDays?: number;
      dailyProfit?: number;
      dailyRate?: number;
      minAmount?: number;
      minTtoAmount?: number;
    },
    index: number
  ) => {
    const fallbackDays = toNumber(item.packageId?.replace(/\D/g, ""), index + 1);
    const days = toNumber(item.days ?? item.durationDays, fallbackDays);
    const dailyRate = toNumber(item.dailyRate);

    return {
      id: item.id ?? item.packageId ?? index + 1,
      name: toString(item.name ?? item.label, `${days} Days Pack`),
      days,
      dailyProfit: toNumber(item.dailyProfit, dailyRate > 0 ? dailyRate * 100 : 0),
      minAmount: toNumber(item.minAmount ?? item.minTtoAmount, 100),
      icon: "fire",
    };
  };

  if (USE_MOCK_API) {
    const packages = await resolveMock(mockBondingPackagesResponse);
    return packages.map(mapPackage);
  }

  const packages = await fetchApi<
    Array<{
      id?: string | number;
      packageId?: string;
      label?: string;
      name?: string;
      days?: number;
      durationDays?: number;
      dailyProfit?: number;
      dailyRate?: number;
      minAmount?: number;
      minTtoAmount?: number;
    }>
  >("/v1/bonding/packages", {
    baseURL: options.baseURL,
  });

  return packages.map(mapPackage);
}

export async function getMyBondingList(
  options: PaginationOptions = {}
): Promise<BondingItem[]> {
  const mapHistoryItem = (
    item: {
      id?: string | number;
      packageLabel?: string;
      packageName?: string;
      packageId?: string;
      principalTto?: number;
      amount?: number;
      ttoAmount?: number;
      status?: string;
      startDate?: string;
      startedAt?: string;
      endDate?: string;
      endsAt?: string;
    },
    index: number
  ) => ({
    id: item.id ?? index + 1,
    packageName: toString(
      item.packageName ?? item.packageLabel ?? item.packageId,
      "Bonding Package"
    ),
    amount: toNumber(item.amount ?? item.principalTto ?? item.ttoAmount),
    token: TOKEN_SYMBOL,
    status: formatStatusLabel(item.status, "Running"),
    startDate: formatDate(item.startDate ?? item.startedAt),
    endDate: formatDate(item.endDate ?? item.endsAt),
  });

  const bondingHistory = USE_MOCK_API
    ? await resolveMock(mockBondingHistoryResponse)
    : await fetchApi<
        Array<{
          id?: string | number;
          packageLabel?: string;
          packageName?: string;
          packageId?: string;
          principalTto?: number;
          amount?: number;
          ttoAmount?: number;
          status?: string;
          startDate?: string;
          startedAt?: string;
          endDate?: string;
          endsAt?: string;
        }>
      >("/v1/bonding/history", {
        baseURL: options.baseURL,
        auth: resolveAuth(options),
        query: {
          page: options.page ?? 1,
          limit: options.limit ?? 100,
        },
      });

  return bondingHistory
    .filter((item) => toString(item.status).toUpperCase() === "RUNNING")
    .map(mapHistoryItem);
}

export async function startBonding(
  packageId: string,
  ttoAmount: number,
  options: ApiAuthOptions = {}
): Promise<BondingStartResult> {
  const auth = resolveAuth(options);

  return fetchApi<BondingStartResult>("/v1/bonding/start", {
    baseURL: options.baseURL,
    method: "POST",
    auth,
    body: {
      packageId,
      ttoAmount,
    },
  });
}

export async function getBondingData(
  options: PaginationOptions = {}
): Promise<BondingData> {
  const [packages, activeItems] = await Promise.all([
    getBondingPackages(options),
    getMyBondingList(options),
  ]);

  return {
    packages,
    myBondingList: activeItems,
  };
}
