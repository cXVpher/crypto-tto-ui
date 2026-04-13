import { PageHeader } from "@/components/layout/page-header";
import { getSwapHistoryData } from "@/lib/api-service";
import { getServerAccessToken } from "@/lib/server-auth";
import { SwapBalance } from "./_components/swap-balance";
import { SwapForm } from "./_components/swap-form";
import { SwapHistoryList } from "./_components/swap-history-list";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export default async function SwapPage() {
  const accessToken = await getServerAccessToken();
  const swapHistory = USE_MOCK_API || accessToken
    ? await getSwapHistoryData({ accessToken })
    : [];

  return (
    <div
      className="relative flex min-h-screen w-full flex-col pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="Swap" />

      <div className="px-4 pt-4">
        <SwapBalance />
        <SwapForm />
        <SwapHistoryList history={swapHistory} />
      </div>
    </div>
  );
}
