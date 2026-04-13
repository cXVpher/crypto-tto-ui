import { getNetworkData } from "@/lib/api-service";
import { getServerAccessToken } from "@/lib/server-auth";
import { NetworkPageClient } from "./_components/network-page-client";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export default async function NetworkPage() {
  const accessToken = await getServerAccessToken();
  const networkData = USE_MOCK_API || accessToken
    ? await getNetworkData({ accessToken })
    : { affiliates: [] };

  return <NetworkPageClient affiliates={networkData.affiliates} />;
}
