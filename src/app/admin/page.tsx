import { getAdminOverviewData } from "@/app/admin/_services/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";
import { OverviewPage } from "@/app/admin/_components/overview-page";

export default async function AdminOverviewRoute() {
  await requireAdminSession();
  const overview = await getAdminOverviewData();

  return <OverviewPage overview={overview} />;
}
