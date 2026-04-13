import { getHistoryData } from "@/lib/api-service";
import { getServerAccessToken } from "@/lib/server-auth";
import { HistoryPageClient } from "./_components/history-page-client";

export default async function HistoryPage() {
  const accessToken = await getServerAccessToken();
  const historyData = accessToken
    ? await getHistoryData({ accessToken })
    : { purchaseHistory: [], withdrawHistory: [] };

  return (
    <HistoryPageClient
      purchaseHistory={historyData.purchaseHistory}
      withdrawHistory={historyData.withdrawHistory}
    />
  );
}
