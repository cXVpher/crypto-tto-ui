import { TransactionsPage } from "@/app/admin/transactions/_components/transactions-page";
import { getAdminTransactionsData } from "@/app/admin/_services/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminTransactionsRoute() {
  await requireAdminSession();
  const transactionsData = await getAdminTransactionsData();

  return <TransactionsPage transactionsData={transactionsData} />;
}
