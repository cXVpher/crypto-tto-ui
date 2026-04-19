"use client";

import { useMemo, useState } from "react";
import {
  PencilSimple,
  Plus,
  ToggleLeft,
  ToggleRight,
} from "@phosphor-icons/react";

import { AdminConfirmDialog } from "@/app/admin/_components/admin-confirm-dialog";
import { DataTable, type DataTableColumn } from "@/app/admin/_components/data-table";
import { StatCard } from "@/app/admin/_components/stat-card";
import {
  formatCompactNumber,
  formatPercent,
  formatTokenAmount,
  getStatusClasses,
} from "@/app/admin/_lib/admin-format";
import type {
  AdminBondingData,
  AdminBondingPackage,
  AdminBondingRecord,
} from "@/app/admin/_types/admin-types";
import { updateAdminBondingRateAction } from "@/app/admin/_services/dashboard-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BondingPageProps {
  bondingData: AdminBondingData;
}

interface PackageFormState {
  id: string | null;
  name: string;
  durationDays: string;
  dailyProfitRate: string;
  minAmount: string;
}

const emptyPackageForm: PackageFormState = {
  id: null,
  name: "",
  durationDays: "",
  dailyProfitRate: "",
  minAmount: "",
};

export function BondingPage({ bondingData }: BondingPageProps) {
  const [packages, setPackages] = useState(bondingData.packages);
  const [savingPackageId, setSavingPackageId] = useState<string | null>(null);
  const activeBondings = bondingData.activeBondings;
  const [packageStatusFilter, setPackageStatusFilter] = useState("ALL");
  const [bondingStatusFilter, setBondingStatusFilter] = useState("ALL");
  const [packageFilter, setPackageFilter] = useState("ALL");
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [packageForm, setPackageForm] = useState<PackageFormState>(emptyPackageForm);
  const [confirmTogglePackageId, setConfirmTogglePackageId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const isMockMode = bondingData.meta.source === "mock";

  const filteredPackages = packages.filter((item) => {
    return packageStatusFilter === "ALL" || item.status === packageStatusFilter;
  });

  const filteredBondings = activeBondings.filter((item) => {
    const matchesStatus =
      bondingStatusFilter === "ALL" || item.status === bondingStatusFilter;
    const matchesPackage =
      packageFilter === "ALL" || item.packageName === packageFilter;

    return matchesStatus && matchesPackage;
  });

  const packageBreakdown = useMemo(
    () =>
      packages.map((item) => ({
        label: item.name,
        value: activeBondings
          .filter((bonding) => bonding.packageName === item.name)
          .reduce((sum, bonding) => sum + bonding.amount, 0),
      })),
    [activeBondings, packages]
  );

  const summary = useMemo(() => {
    const runningCount = activeBondings.filter((item) => item.status === "RUNNING").length;
    const averageDurationDays =
      packages.reduce((sum, item) => sum + item.durationDays, 0) / Math.max(packages.length, 1);

    return [
      {
        label: "Active packages",
        value: packages.filter((item) => item.status === "ACTIVE").length,
        change: `${packages.length} total`,
        detail: "available in the current package catalogue",
        tone: "cyan" as const,
        format: "integer" as const,
      },
      {
        label: "Running bondings",
        value: runningCount,
        change: `${filteredBondings.length} visible`,
        detail: "positions currently running under active filters",
        tone: "emerald" as const,
        format: "integer" as const,
      },
      {
        label: "Average duration",
        value: averageDurationDays,
        change: "catalogue average",
        detail: "days across all configured package variants",
        tone: "amber" as const,
        format: "integer" as const,
      },
    ];
  }, [filteredBondings.length, activeBondings, packages]);

  const maxBreakdown = Math.max(...packageBreakdown.map((item) => item.value), 1);
  const confirmPackage = packages.find((item) => item.id === confirmTogglePackageId) ?? null;

  const openCreateDialog = () => {
    if (!isMockMode) {
      setNotice("The live admin API only supports rate updates for existing packages.");
      return;
    }

    setPackageForm(emptyPackageForm);
    setPackageDialogOpen(true);
  };

  const openEditDialog = (item: AdminBondingPackage) => {
    setPackageForm({
      id: item.id,
      name: item.name,
      durationDays: String(item.durationDays),
      dailyProfitRate: String(item.dailyProfitRate),
      minAmount: String(item.minAmount),
    });
    setPackageDialogOpen(true);
  };

  const submitPackageForm = async () => {
    const durationDays = Number(packageForm.durationDays);
    const dailyProfitRate = Number(packageForm.dailyProfitRate);
    const minAmount = Number(packageForm.minAmount);

    if (
      !Number.isFinite(dailyProfitRate) ||
      (isMockMode &&
        (!packageForm.name.trim() ||
          !Number.isFinite(durationDays) ||
          !Number.isFinite(minAmount)))
    ) {
      setNotice(
        isMockMode
          ? "Package form needs valid name, duration, daily rate, and minimum."
          : "A valid daily rate is required."
      );
      return;
    }

    if (isMockMode && packageForm.id) {
      setPackages((currentPackages) =>
        currentPackages.map((item) =>
          item.id === packageForm.id
            ? {
                ...item,
                name: packageForm.name.trim(),
                durationDays,
                dailyProfitRate,
                minAmount,
              }
            : item
        )
      );
      setNotice(`Updated ${packageForm.name.trim()} locally.`);
    } else if (isMockMode) {
      const nextPackage: AdminBondingPackage = {
        id: `pkg-${Date.now()}`,
        name: packageForm.name.trim(),
        durationDays,
        dailyProfitRate,
        minAmount,
        status: "ACTIVE",
      };

      setPackages((currentPackages) => [nextPackage, ...currentPackages]);
      setNotice(`Created ${nextPackage.name} locally.`);
    } else {
      const selectedPackage = packages.find((item) => item.id === packageForm.id);

      if (!selectedPackage?.packageId) {
        setNotice("Only existing backend packages can be updated in live mode.");
        return;
      }

      try {
        setSavingPackageId(selectedPackage.id);
        await updateAdminBondingRateAction({
          packageId: selectedPackage.packageId,
          dailyProfitRate,
        });

        setPackages((currentPackages) =>
          currentPackages.map((item) =>
            item.id === selectedPackage.id
              ? {
                  ...item,
                  dailyProfitRate,
                }
              : item
          )
        );
        setNotice(`Updated ${selectedPackage.name} via the admin API.`);
      } catch (error) {
        setNotice(
          error instanceof Error ? error.message : "Unable to update the bonding rate."
        );
        return;
      } finally {
        setSavingPackageId(null);
      }
    }

    setPackageDialogOpen(false);
    setPackageForm(emptyPackageForm);
  };

  const togglePackageStatus = (packageId: string) => {
    setPackages((currentPackages) =>
      currentPackages.map((item) =>
        item.id === packageId
          ? {
              ...item,
              status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : item
      )
    );
  };

  const packageColumns: DataTableColumn<AdminBondingPackage>[] = [
    {
      key: "name",
      header: "Package",
      cell: (item) => (
        <div>
          <p className="font-medium text-white">{item.name}</p>
          <p className="mt-1 text-xs text-slate-500">{item.durationDays} days</p>
        </div>
      ),
    },
    {
      key: "profit",
      header: "Daily profit",
      cell: (item) => <span className="text-slate-200">{formatPercent(item.dailyProfitRate)}</span>,
    },
    {
      key: "minimum",
      header: "Minimum",
      cell: (item) => <span className="text-slate-200">{formatTokenAmount(item.minAmount)}</span>,
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => (
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
            item.status
          )}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[260px]",
      cell: (item) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => openEditDialog(item)}
            disabled={savingPackageId === item.id}
            className="h-10 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
          >
            <PencilSimple className="size-4" />
            {savingPackageId === item.id
              ? "Saving..."
              : isMockMode
                ? "Edit"
                : "Update rate"}
          </Button>
          {isMockMode ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setConfirmTogglePackageId(item.id)}
              className="h-10 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
            >
              {item.status === "ACTIVE" ? (
                <ToggleRight className="size-4" />
              ) : (
                <ToggleLeft className="size-4" />
              )}
              {item.status === "ACTIVE" ? "Deactivate" : "Activate"}
            </Button>
          ) : null}
        </div>
      ),
    },
  ];

  const activeBondingColumns: DataTableColumn<AdminBondingRecord>[] = [
    {
      key: "wallet",
      header: "Wallet",
      cell: (item) => <span className="font-medium text-white">{item.userWallet}</span>,
    },
    {
      key: "package",
      header: "Package",
      cell: (item) => <span className="text-slate-200">{item.packageName}</span>,
    },
    {
      key: "amount",
      header: "Amount",
      cell: (item) => <span className="text-slate-200">{formatTokenAmount(item.amount)}</span>,
    },
    {
      key: "window",
      header: "Window",
      cell: (item) => (
        <div className="text-slate-200">
          <p>{item.startDate}</p>
          <p className="mt-1 text-xs text-slate-500">{item.endDate}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (item) => (
        <span
          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
            item.status
          )}`}
        >
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        {summary.map((metric) => (
          <StatCard key={metric.label} metric={metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Package distribution
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Bonding volume by package type
              </h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300">
              {formatCompactNumber(filteredBondings.length)} filtered positions
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {packageBreakdown.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="text-slate-300">{item.label}</span>
                  <span className="text-white">{formatTokenAmount(item.value)}</span>
                </div>
                <div className="h-3 rounded-full bg-white/6">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300"
                    style={{
                      width: `${(item.value / maxBreakdown) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                Package configuration
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white">
                Create, edit, and toggle package visibility
              </h2>
            </div>
            <Button
              type="button"
              onClick={openCreateDialog}
              disabled={!isMockMode}
              className="h-11 rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            >
              <Plus className="size-4" />
              {isMockMode ? "Create package" : "Rate-only mode"}
            </Button>
          </div>

          {notice ? (
            <div className="mt-5 rounded-[1.5rem] border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
              {notice}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3 md:grid-cols-[220px_minmax(0,1fr)]">
            <Select
              value={packageStatusFilter}
              onValueChange={(value) => {
                if (value) {
                  setPackageStatusFilter(value);
                }
              }}
            >
              <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/5 px-4 text-sm text-slate-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-white/10 bg-[#081224] text-slate-100">
                <SelectItem value="ALL">All package statuses</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <div className="rounded-[1.5rem] border border-white/8 bg-white/4 px-4 py-3 text-sm text-slate-400">
              {isMockMode
                ? "Changes are local in mock mode and are meant to validate the admin workflow before live mutations are used."
                : "Live mode currently supports updating existing package rates only. Package creation, visibility toggles, and minimum amounts are not exposed by the current admin API."}
            </div>
          </div>

          {bondingData.meta.notice ? (
            <div className="mt-5 rounded-[1.5rem] border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
              {bondingData.meta.notice}
            </div>
          ) : null}

          <div className="mt-5">
            <DataTable
              data={filteredPackages}
              columns={packageColumns}
              getRowId={(item) => item.id}
              emptyMessage="No bonding packages are configured."
              renderCard={(item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/8 bg-[#081224]/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.durationDays} days</p>
                    </div>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        item.status
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-slate-500">Daily profit</p>
                      <p className="mt-1 text-slate-100">
                        {formatPercent(item.dailyProfitRate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Minimum</p>
                      <p className="mt-1 text-slate-100">{formatTokenAmount(item.minAmount)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openEditDialog(item)}
                      disabled={savingPackageId === item.id}
                      className="h-11 flex-1 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    >
                      {savingPackageId === item.id
                        ? "Saving..."
                        : isMockMode
                          ? "Edit"
                          : "Update rate"}
                    </Button>
                    {isMockMode ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setConfirmTogglePackageId(item.id)}
                        className="h-11 flex-1 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                      >
                        {item.status === "ACTIVE" ? "Deactivate" : "Activate"}
                      </Button>
                    ) : null}
                  </div>
                </article>
              )}
            />
          </div>
        </article>
      </section>

      <section className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Active bondings
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Running and pending user positions
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-[220px_220px]">
          <Select
            value={packageFilter}
            onValueChange={(value) => {
              if (value) {
                setPackageFilter(value);
              }
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/5 px-4 text-sm text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-white/10 bg-[#081224] text-slate-100">
              <SelectItem value="ALL">All package names</SelectItem>
              {packages.map((item) => (
                <SelectItem key={item.id} value={item.name}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={bondingStatusFilter}
            onValueChange={(value) => {
              if (value) {
                setBondingStatusFilter(value);
              }
            }}
          >
            <SelectTrigger className="h-11 w-full rounded-2xl border-white/10 bg-white/5 px-4 text-sm text-slate-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border border-white/10 bg-[#081224] text-slate-100">
              <SelectItem value="ALL">All bonding statuses</SelectItem>
              <SelectItem value="RUNNING">Running</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="MATURED">Matured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mt-5">
          <DataTable
            data={filteredBondings}
            columns={activeBondingColumns}
            getRowId={(item) => item.id}
            emptyMessage="No user bondings are available."
            renderCard={(item) => (
              <article
                key={item.id}
                className="relative rounded-[1.5rem] border border-white/8 bg-[#081224]/80 p-4"
              >
                <div className="pr-28">
                  <div>
                    <p className="font-semibold text-white">{item.packageName}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.userWallet}</p>
                  </div>
                </div>
                <span
                  className={`absolute right-4 top-4 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500">Amount</p>
                    <p className="mt-1 text-slate-100">{formatTokenAmount(item.amount)}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Window</p>
                    <p className="mt-1 text-slate-100">{item.startDate}</p>
                    <p className="text-xs text-slate-500">{item.endDate}</p>
                  </div>
                </div>
              </article>
            )}
          />
        </div>
      </section>

      <Dialog open={packageDialogOpen} onOpenChange={setPackageDialogOpen}>
        <DialogContent className="max-w-lg rounded-[1.75rem] border border-white/8 bg-[#07101d] p-0 text-white">
          <DialogHeader className="px-5 pt-5">
            <DialogTitle>
              {isMockMode
                ? packageForm.id
                  ? "Edit bonding package"
                  : "Create bonding package"
                : "Update bonding rate"}
            </DialogTitle>
            <DialogDescription className="leading-6 text-slate-400">
              {isMockMode
                ? "Update the package catalogue locally to validate admin operations in mock mode."
                : "The live admin API currently exposes rate updates for existing packages only."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 px-5 pb-5">
            <div>
              <label htmlFor="package-name" className="text-sm text-slate-300">
                Package name
              </label>
              <Input
                id="package-name"
                value={packageForm.name}
                onChange={(event) =>
                  setPackageForm((current) => ({ ...current, name: event.target.value }))
                }
                disabled={!isMockMode}
                className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="package-days" className="text-sm text-slate-300">
                  Days
                </label>
                <Input
                  id="package-days"
                  value={packageForm.durationDays}
                  onChange={(event) =>
                    setPackageForm((current) => ({
                      ...current,
                      durationDays: event.target.value,
                    }))
                  }
                  disabled={!isMockMode}
                  className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
                />
              </div>
              <div>
                <label htmlFor="package-rate" className="text-sm text-slate-300">
                  Daily %
                </label>
                <Input
                  id="package-rate"
                  value={packageForm.dailyProfitRate}
                  onChange={(event) =>
                    setPackageForm((current) => ({
                      ...current,
                      dailyProfitRate: event.target.value,
                    }))
                  }
                  className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
                />
              </div>
              <div>
                <label htmlFor="package-min" className="text-sm text-slate-300">
                  Min TTO
                </label>
                <Input
                  id="package-min"
                  value={packageForm.minAmount}
                  onChange={(event) =>
                    setPackageForm((current) => ({
                      ...current,
                      minAmount: event.target.value,
                    }))
                  }
                  disabled={!isMockMode}
                  className="mt-2 h-11 rounded-2xl border-white/10 bg-white/5"
                />
              </div>
            </div>
            {!isMockMode ? (
              <p className="text-sm leading-6 text-slate-400">
                Package name, duration, and minimum are read-only because the current admin API
                only allows rate updates.
              </p>
            ) : null}
          </div>
          <DialogFooter className="rounded-b-[1.75rem] border-white/8 bg-white/4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPackageDialogOpen(false)}
              className="h-11 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                void submitPackageForm();
              }}
              className="h-11 rounded-2xl bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            >
              {savingPackageId
                ? "Saving..."
                : isMockMode
                  ? packageForm.id
                    ? "Save changes"
                    : "Create package"
                  : "Save rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AdminConfirmDialog
        open={isMockMode && confirmPackage != null}
        onOpenChange={(open) => !open && setConfirmTogglePackageId(null)}
        title={
          confirmPackage?.status === "ACTIVE"
            ? `Deactivate ${confirmPackage.name}?`
            : `Activate ${confirmPackage?.name}?`
        }
        description={
          confirmPackage?.status === "ACTIVE"
            ? "This local admin action will hide the package from the active catalogue in mock mode."
            : "This local admin action will return the package to the active catalogue in mock mode."
        }
        confirmLabel={
          confirmPackage?.status === "ACTIVE" ? "Deactivate package" : "Activate package"
        }
        tone={confirmPackage?.status === "ACTIVE" ? "destructive" : "default"}
        onConfirm={() => {
          if (!confirmTogglePackageId || !confirmPackage) {
            return;
          }

          togglePackageStatus(confirmTogglePackageId);
          setNotice(
            confirmPackage.status === "ACTIVE"
              ? `${confirmPackage.name} was moved to INACTIVE locally.`
              : `${confirmPackage.name} was moved to ACTIVE locally.`
          );
        }}
      />
    </div>
  );
}
