// src/app/profile/page.tsx
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { userProfile } from "@/lib/mock-data";
import { ProfileHeader } from "./_components/profile-header";
import { ProfileInfoList } from "./_components/profile-info-list";
import { LogoutButton } from "./_components/logout-button";

export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
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
