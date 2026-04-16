import { UsersPage } from "@/components/admin/users-page";
import { getAdminUsersData } from "@/lib/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminUsersRoute() {
  await requireAdminSession();
  const usersData = await getAdminUsersData();

  return <UsersPage usersData={usersData} />;
}
