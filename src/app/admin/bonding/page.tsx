import { BondingPage } from "@/components/admin/bonding-page";
import { getAdminBondingData } from "@/lib/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminBondingRoute() {
  await requireAdminSession();
  const bondingData = await getAdminBondingData();

  return <BondingPage bondingData={bondingData} />;
}
