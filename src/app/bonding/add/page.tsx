import { PageHeader } from "@/components/layout/page-header";
import { getBondingPackages } from "@/app/bonding/_services/bonding-service";
import { AddBondingForm } from "./_components/add-bonding-form";

interface AddBondingPageProps {
  searchParams: Promise<{
    package?: string | string[];
  }>;
}

export default async function AddBondingPage({
  searchParams,
}: AddBondingPageProps) {
  const packages = await getBondingPackages();
  const resolvedSearchParams = await searchParams;
  const packageParam = resolvedSearchParams.package;
  const preselectedPackage = Array.isArray(packageParam)
    ? packageParam[0]
    : packageParam;

  return (
    <div className="flex min-h-screen flex-col pb-24">
      <PageHeader title="Bonding Package" />
      <AddBondingForm
        packages={packages}
        preselectedPackage={preselectedPackage}
      />
    </div>
  );
}
