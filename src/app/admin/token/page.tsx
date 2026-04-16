import { TokenPage } from "@/components/admin/token-page";
import { getAdminTokenData } from "@/lib/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminTokenRoute() {
  await requireAdminSession();
  const tokenData = await getAdminTokenData();

  return <TokenPage tokenData={tokenData} />;
}
