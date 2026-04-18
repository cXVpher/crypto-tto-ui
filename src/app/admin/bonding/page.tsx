import { BondingPage } from "@/app/admin/bonding/_components/bonding-page";
import { getAdminBondingData } from "@/app/admin/_services/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminBondingRoute() {
  await requireAdminSession();
  const bondingData = await getAdminBondingData();

  return <BondingPage bondingData={bondingData} />;
}
