// src/app/bonding/page.tsx
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { BondingPackageList } from "./_components/bonding-package-list";
import { MyBondingList } from "./_components/my-bonding-list";

export default function BondingPage() {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="Bonding" />
      <BondingPackageList />
      <MyBondingList />
    </div>
  );
}
