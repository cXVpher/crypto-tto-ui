import { getAdminOverviewData } from "@/lib/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";
import { OverviewPage } from "@/components/admin/overview-page";

export default async function AdminOverviewRoute() {
  await requireAdminSession();
  const overview = await getAdminOverviewData();

  return <OverviewPage overview={overview} />;
}
