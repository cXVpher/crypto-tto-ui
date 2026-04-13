import { getNetworkData } from "@/lib/api-service";
import { getServerAccessToken } from "@/lib/server-auth";
import { NetworkPageClient } from "./_components/network-page-client";

export default async function NetworkPage() {
  const accessToken = await getServerAccessToken();
  const networkData = accessToken
    ? await getNetworkData({ accessToken })
    : { affiliates: [] };

  return <NetworkPageClient affiliates={networkData.affiliates} />;
}
