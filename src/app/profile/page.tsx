// src/app/profile/page.tsx
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { userProfile } from "@/lib/mock-data";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileInfoList } from "./_components/profile-info-list";
import { LogoutButton } from "./_components/logout-button";

export default function ProfilePage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="Profile" />

      <div className="px-4 pt-6">
        <ProfileHeader />
        <ProfileInfoList />
        <LogoutButton />

        {/* Version */}
        <p className="text-center text-[10px] text-muted-foreground/50 mt-6">
          {userProfile.version}
        </p>
      </div>
    </div>
  );
}
