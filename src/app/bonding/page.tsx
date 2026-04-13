import { PageHeader } from "@/components/layout/page-header";
import { getBondingPackages, getMyBondingList } from "@/lib/api-service";
import { getServerAccessToken } from "@/lib/server-auth";
import { BondingPackageList } from "./_components/bonding-package-list";
import { MyBondingList } from "./_components/my-bonding-list";

const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === "true";

export default async function BondingPage() {
  const accessToken = await getServerAccessToken();
  const [packages, myBondingList] = await Promise.all([
    getBondingPackages(),
    USE_MOCK_API || accessToken
      ? getMyBondingList({ accessToken })
      : Promise.resolve([]),
  ]);

  return (
    <div
      className="relative flex min-h-screen w-full flex-col pb-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 0% 0%, #1a3a6e 0%, #0a1a3d 35%, #000e26 65%, #000510 100%)",
        color: "#dbe5ff",
      }}
    >
      <PageHeader title="Bonding" />
      <BondingPackageList packages={packages} />
      <MyBondingList items={myBondingList} />
    </div>
  );
}
