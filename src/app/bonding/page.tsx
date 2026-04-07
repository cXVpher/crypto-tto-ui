// src/app/bonding/page.tsx
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { BondingPackageList } from "./_components/bonding-package-list";
import { MyBondingList } from "./_components/my-bonding-list";

export default function BondingPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24">
      <PageHeader title="Bonding" />
      <BondingPackageList />
      <MyBondingList />
    </div>
  );
}
