import { UsersPage } from "@/app/admin/users/_components/users-page";
import { getAdminUsersData } from "@/app/admin/_services/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminUsersRoute() {
  await requireAdminSession();
  const usersData = await getAdminUsersData();

  return <UsersPage usersData={usersData} />;
}
