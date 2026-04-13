import { getHistoryData } from "@/lib/api-service";
import { getServerAccessToken } from "@/lib/server-auth";
import { HistoryPageClient } from "./_components/history-page-client";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export default async function HistoryPage() {
  const accessToken = await getServerAccessToken();
  const historyData = USE_MOCK_API || accessToken
    ? await getHistoryData({ accessToken })
    : { purchaseHistory: [], withdrawHistory: [] };

  return (
    <HistoryPageClient
      purchaseHistory={historyData.purchaseHistory}
      withdrawHistory={historyData.withdrawHistory}
    />
  );
}
