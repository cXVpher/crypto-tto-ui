import { SettingsPage } from "@/app/admin/settings/_components/settings-page";
import { getAdminSettingsData } from "@/app/admin/_services/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminSettingsRoute() {
  await requireAdminSession();
  const settingsData = await getAdminSettingsData();

  return <SettingsPage settingsData={settingsData} />;
}
