import { TokenPage } from "@/app/admin/token/_components/token-page";
import { getAdminTokenData } from "@/app/admin/_services/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminTokenRoute() {
  await requireAdminSession();
  const tokenData = await getAdminTokenData();

  return <TokenPage tokenData={tokenData} />;
}
