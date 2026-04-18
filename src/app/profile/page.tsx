import { PageHeader } from "@/components/layout/page-header";
import { userProfile } from "@/app/_lib/mock-data";
import { getProfileData } from "@/app/profile/_services/profile-service";
import { getServerAccessToken } from "@/lib/server-auth";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileInfoList } from "./_components/profile-info-list";
import { LogoutButton } from "./_components/logout-button";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export default async function ProfilePage() {
  const accessToken = await getServerAccessToken();
  const profile = USE_MOCK_API || accessToken
    ? await getProfileData({ accessToken })
    : userProfile;

  return (
    <div
      className="relative flex min-h-screen w-full flex-col pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="Profile" />

      <div className="px-4 pt-6">
        <ProfileHeader profile={profile} />
        <ProfileInfoList profile={profile} />
        <LogoutButton />

        {/* Version */}
        <p className="mt-6 text-center text-[10px]" style={{ color: "#6f83ab" }}>
          {profile.version}
        </p>
      </div>
    </div>
  );
}
