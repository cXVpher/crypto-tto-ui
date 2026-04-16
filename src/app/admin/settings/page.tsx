import { SettingsPage } from "@/components/admin/settings-page";
import { getAdminSettingsData } from "@/lib/admin-api-service";
import { requireAdminSession } from "@/lib/admin-session";

export default async function AdminSettingsRoute() {
  await requireAdminSession();
  const settingsData = await getAdminSettingsData();

  return <SettingsPage settingsData={settingsData} />;
}
