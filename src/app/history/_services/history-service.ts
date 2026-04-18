import { getPurchaseHistoryData } from "@/app/purchase/_services/purchase-service";
import { getWithdrawHistoryData } from "@/app/withdraw/_services/withdraw-service";
import type { HistoryData, PaginationOptions } from "@/app/_types/api-types";

export async function getHistoryData(
  options: PaginationOptions = {}
): Promise<HistoryData> {
  const [purchaseItems, withdrawItems] = await Promise.all([
    getPurchaseHistoryData(options),
    getWithdrawHistoryData(options),
  ]);

  return {
    purchaseHistory: purchaseItems,
    withdrawHistory: withdrawItems,
  };
}
