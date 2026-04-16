import { TransactionsPage } from "@/components/admin/transactions-page";
import { getAdminTransactionsData } from "@/lib/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminTransactionsRoute() {
  await requireAdminSession();
  const transactionsData = await getAdminTransactionsData();

  return <TransactionsPage transactionsData={transactionsData} />;
}
