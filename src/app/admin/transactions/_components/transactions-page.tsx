"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  CheckCircle,
  Eye,
  Funnel,
  ArrowClockwise,
  XCircle,
} from "@phosphor-icons/react";

import { AdminConfirmDialog } from "@/app/admin/_components/admin-confirm-dialog";
import { DataTable, type DataTableColumn } from "@/app/admin/_components/data-table";
import { useAdaptiveSheetSide } from "@/app/admin/_hooks/use-adaptive-sheet-side";
import {
  formatTokenAmount,
  formatUsd,
  getStatusClasses,
  parseAdminDate,
} from "@/app/admin/_lib/admin-format";
import type {
  AdminPurchase,
  AdminSwap,
  AdminTransactionsData,
  AdminTransactionStatus,
  AdminWithdrawal,
} from "@/app/admin/_types/admin-types";
import { retryAdminWithdrawalAction } from "@/app/admin/_services/dashboard-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { downloadCsvFile } from "@/lib/csv";

interface TransactionsPageProps {
  transactionsData: AdminTransactionsData;
}

type TransactionsTab = "purchases" | "swaps" | "withdrawals";

type SelectedTransaction =
  | { type: "purchase"; item: AdminPurchase }
  | { type: "swap"; item: AdminSwap }
  | { type: "withdrawal"; item: AdminWithdrawal };

type PendingWithdrawalDecision =
  | { withdrawalId: string; decision: "approve" | "reject" }
  | null;

interface TransactionsFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  minAmount: string;
  onMinAmountChange: (value: string) => void;
  maxAmount: string;
  onMaxAmountChange: (value: string) => void;
}

function TransactionsFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  minAmount,
  onMinAmountChange,
  maxAmount,
  onMaxAmountChange,
}: TransactionsFilterProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_170px_170px_140px_140px]">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Filter by username"
        className="h-11 rounded-2xl border-white/10 bg-white/5"
      />
      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
        className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-100 outline-none"
      >
        <option value="ALL">All statuses</option>
        <option value="COMPLETED">Completed</option>
        <option value="PENDING">Pending</option>
        <option value="VERIFIED">Verified</option>
        <option value="PROCESSING">Processing</option>
        <option value="REVIEW">Review</option>
        <option value="FAILED">Failed</option>
      </select>
      <Input
        type="date"
        value={startDate}
        onChange={(event) => onStartDateChange(event.target.value)}
        className="h-11 rounded-2xl border-white/10 bg-white/5"
      />
      <Input
        type="date"
        value={endDate}
        onChange={(event) => onEndDateChange(event.target.value)}
        className="h-11 rounded-2xl border-white/10 bg-white/5"
      />
      <Input
        value={minAmount}
        onChange={(event) => onMinAmountChange(event.target.value)}
        placeholder="Min"
        className="h-11 rounded-2xl border-white/10 bg-white/5"
      />
      <Input
        value={maxAmount}
        onChange={(event) => onMaxAmountChange(event.target.value)}
        placeholder="Max"
        className="h-11 rounded-2xl border-white/10 bg-white/5"
      />
    </div>
  );
}

function buildMockTxHash(id: string) {
  return `0x${id.replace(/[^a-z0-9]/gi, "").padEnd(32, "a").slice(0, 32)}`;
}

export function TransactionsPage({ transactionsData }: TransactionsPageProps) {
  const [activeTab, setActiveTab] = useState<TransactionsTab>("purchases");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<SelectedTransaction | null>(
    null
  );
  const purchases = transactionsData.purchases;
  const swaps = transactionsData.swaps;
  const [withdrawals, setWithdrawals] = useState(transactionsData.withdrawals);
  const [pendingDecision, setPendingDecision] = useState<PendingWithdrawalDecision>(null);
  const [notice, setNotice] = useState("");
  const [retryWithdrawalId, setRetryWithdrawalId] = useState<string | null>(null);
  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const detailSide = useAdaptiveSheetSide();
  const isMockMode = transactionsData.meta.source === "mock";

  const matchesFilters = (
    user: string,
    status: AdminTransactionStatus,
    dateValue: string,
    amount: number
  ) => {
    const matchesSearch =
      normalizedSearch.length === 0 || user.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "ALL" || status === statusFilter;

    const parsedDate = parseAdminDate(dateValue);
    const startBoundary = startDate ? new Date(`${startDate}T00:00:00`) : null;
    const endBoundary = endDate ? new Date(`${endDate}T23:59:59`) : null;
    const matchesStart = !startBoundary || (parsedDate ? parsedDate >= startBoundary : true);
    const matchesEnd = !endBoundary || (parsedDate ? parsedDate <= endBoundary : true);

    const minAmountValue = Number(minAmount);
    const maxAmountValue = Number(maxAmount);
    const matchesMin =
      !Number.isFinite(minAmountValue) || minAmount.trim() === "" || amount >= minAmountValue;
    const matchesMax =
      !Number.isFinite(maxAmountValue) || maxAmount.trim() === "" || amount <= maxAmountValue;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesStart &&
      matchesEnd &&
      matchesMin &&
      matchesMax
    );
  };

  const transactions = {
    purchases: purchases.filter((item) =>
      matchesFilters(item.user, item.status, item.date, item.amountUsdt)
    ),
    swaps: swaps.filter((item) =>
      matchesFilters(item.user, item.status, item.date, item.toUsdt)
    ),
    withdrawals: withdrawals.filter((item) =>
      matchesFilters(item.user, item.status, item.date, item.amount)
    ),
  };

  const pendingWithdrawals = withdrawals.filter(
    (item) => item.status === "PENDING" || item.status === "PROCESSING"
  ).length;
  const activeRows = transactions[activeTab];
  const decisionTarget =
    pendingDecision == null
      ? null
      : withdrawals.find((item) => item.id === pendingDecision.withdrawalId) ?? null;
  const selectedTransactionHash =
    selectedTransaction?.item.txHash ??
    (selectedTransaction && isMockMode
      ? buildMockTxHash(selectedTransaction.item.id)
      : "Unavailable");
  const availableTabs = useMemo(
    () =>
      ([
        ["purchases", "Purchases"],
        ...(transactionsData.capabilities.liveSwaps || swaps.length > 0 || isMockMode
          ? ([["swaps", isMockMode ? "Swaps" : "Swaps unavailable"]] as Array<
              [TransactionsTab, string]
            >)
          : []),
        ["withdrawals", "Withdrawals"],
      ] as Array<[TransactionsTab, string]>),
    [isMockMode, swaps.length, transactionsData.capabilities.liveSwaps]
  );

  const approveOrRejectWithdrawal = (decision: "approve" | "reject") => {
    if (!decisionTarget) {
      return;
    }

    setWithdrawals((currentWithdrawals) =>
      currentWithdrawals.map((item) =>
        item.id === decisionTarget.id
          ? {
              ...item,
              status: decision === "approve" ? "COMPLETED" : "FAILED",
            }
          : item
      )
    );

    setNotice(
      decision === "approve"
        ? `${decisionTarget.user} withdrawal was approved locally.`
        : `${decisionTarget.user} withdrawal was rejected locally.`
    );
  };

  const retryWithdrawal = async (withdrawalId: string) => {
    const target = withdrawals.find((item) => item.id === withdrawalId);

    if (!target) {
      return;
    }

    if (isMockMode) {
      setWithdrawals((currentWithdrawals) =>
        currentWithdrawals.map((item) =>
          item.id === withdrawalId
            ? {
                ...item,
                status: "PROCESSING",
              }
            : item
        )
      );
      setNotice(`${target.user} withdrawal was retried locally.`);
      return;
    }

    try {
      setRetryWithdrawalId(withdrawalId);
      await retryAdminWithdrawalAction({ withdrawalId });
      setWithdrawals((currentWithdrawals) =>
        currentWithdrawals.map((item) =>
          item.id === withdrawalId
            ? {
                ...item,
                status: "PROCESSING",
              }
            : item
        )
      );
      setNotice(`${target.user} withdrawal was queued for retry via the admin API.`);
    } catch (error) {
      setNotice(
        error instanceof Error ? error.message : "Unable to retry the withdrawal."
      );
    } finally {
      setRetryWithdrawalId(null);
    }
  };

  const purchaseColumns: DataTableColumn<AdminPurchase>[] = [
    {
      key: "user",
      header: "User",
      cell: (item) => <span className="font-medium text-white">{item.user}</span>,
    },
    {
      key: "usdt",
      header: "Amount USDT",
      cell: (item) => <span className="text-slate-200">{formatUsd(item.amountUsdt)}</span>,
    },
    {
      key: "tto",
      header: "Received TTO",
      cell: (item) => <span className="text-slate-200">{formatTokenAmount(item.receivedTto)}</span>,
    },
    {
      key: "date",
      header: "Date",
      cell: (item) => <span className="text-slate-300">{item.date}</span>,
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
      cell: (item) => (
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedTransaction({ type: "purchase", item })}
          className="h-10 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
        >
          <Eye className="size-4" />
          Details
        </Button>
      ),
    },
  ];

  const swapColumns: DataTableColumn<AdminSwap>[] = [
    {
      key: "user",
      header: "User",
      cell: (item) => <span className="font-medium text-white">{item.user}</span>,
    },
    {
      key: "from",
      header: "From",
      cell: (item) => <span className="text-slate-200">{formatTokenAmount(item.fromTto)}</span>,
    },
    {
      key: "to",
      header: "To",
      cell: (item) => <span className="text-slate-200">{formatUsd(item.toUsdt)}</span>,
    },
    {
      key: "date",
      header: "Date",
      cell: (item) => <span className="text-slate-300">{item.date}</span>,
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
      cell: (item) => (
        <Button
          type="button"
          variant="outline"
          onClick={() => setSelectedTransaction({ type: "swap", item })}
          className="h-10 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
        >
          <Eye className="size-4" />
          Details
        </Button>
      ),
    },
  ];

  const withdrawalColumns: DataTableColumn<AdminWithdrawal>[] = [
    {
      key: "user",
      header: "User",
      cell: (item) => <span className="font-medium text-white">{item.user}</span>,
    },
    {
      key: "amount",
      header: "Amount USDT",
      cell: (item) => <span className="text-slate-200">{formatUsd(item.amount)}</span>,
    },
    {
      key: "wallet",
      header: "Wallet",
      cell: (item) => <span className="text-slate-300">{item.wallet}</span>,
    },
    {
      key: "fee",
      header: "Fee",
      cell: (item) => <span className="text-slate-200">{formatUsd(item.fee)}</span>,
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
      className: "w-[270px]",
      cell: (item) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedTransaction({ type: "withdrawal", item })}
            className="h-10 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
          >
            <Eye className="size-4" />
            Details
          </Button>
          {item.status === "PENDING" ? (
            transactionsData.capabilities.reviewPendingWithdrawal ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPendingDecision({ withdrawalId: item.id, decision: "approve" })
                  }
                  className="h-10 rounded-2xl border-emerald-300/16 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20"
                >
                  <CheckCircle className="size-4" />
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setPendingDecision({ withdrawalId: item.id, decision: "reject" })
                  }
                  className="h-10 rounded-2xl border-rose-300/16 bg-rose-300/10 text-rose-100 hover:bg-rose-300/20"
                >
                  <XCircle className="size-4" />
                  Reject
                </Button>
              </>
            ) : null
          ) : null}
          {item.status === "FAILED" && transactionsData.capabilities.retryFailedWithdrawal ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  void retryWithdrawal(item.id);
                }}
                disabled={retryWithdrawalId === item.id}
                className="h-10 rounded-2xl border-emerald-300/16 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20"
              >
                <ArrowClockwise className="size-4" />
                {retryWithdrawalId === item.id ? "Retrying..." : "Retry"}
              </Button>
            </>
          ) : null}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Transaction monitoring
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Purchases, swaps, and withdrawal review
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              {pendingWithdrawals} withdrawal{pendingWithdrawals === 1 ? "" : "s"} currently
              {isMockMode ? " waiting for manual action." : " processing in the backend queue."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFilterSheetOpen(true)}
              className="h-11 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10 md:hidden"
            >
              <Funnel className="size-4" />
              Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                downloadCsvFile(
                  `admin-${activeTab}.csv`,
                  activeRows.map((row) => ({ ...row }))
                )
              }
              className="h-11 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
            >
              Export current tab
            </Button>
          </div>
        </div>

        {notice ? (
          <div className="mt-5 rounded-[1.5rem] border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
            {notice}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          {availableTabs.map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 hidden md:block">
          <TransactionsFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            minAmount={minAmount}
            onMinAmountChange={setMinAmount}
            maxAmount={maxAmount}
            onMaxAmountChange={setMaxAmount}
          />
        </div>

        {transactionsData.meta.notice ? (
          <div className="mt-5 rounded-[1.5rem] border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
            {transactionsData.meta.notice}
          </div>
        ) : null}

        <div className="mt-5">
          {activeTab === "purchases" ? (
            <DataTable
              data={transactions.purchases}
              columns={purchaseColumns}
              getRowId={(item) => item.id}
              emptyMessage="No purchases match the current filters."
              renderCard={(item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/8 bg-[#081224]/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.user}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.date}</p>
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
                      <p className="text-slate-500">USDT</p>
                      <p className="mt-1 text-slate-100">{formatUsd(item.amountUsdt)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">TTO received</p>
                      <p className="mt-1 text-slate-100">{formatTokenAmount(item.receivedTto)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedTransaction({ type: "purchase", item })}
                    className="mt-4 h-11 w-full rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                  >
                    Details
                  </Button>
                </article>
              )}
            />
          ) : null}

          {activeTab === "swaps" ? (
            <DataTable
              data={transactions.swaps}
              columns={swapColumns}
              getRowId={(item) => item.id}
              emptyMessage="No swaps match the current filters."
              renderCard={(item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/8 bg-[#081224]/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.user}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.date}</p>
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
                      <p className="text-slate-500">From</p>
                      <p className="mt-1 text-slate-100">{formatTokenAmount(item.fromTto)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">To</p>
                      <p className="mt-1 text-slate-100">{formatUsd(item.toUsdt)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedTransaction({ type: "swap", item })}
                    className="mt-4 h-11 w-full rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                  >
                    Details
                  </Button>
                </article>
              )}
            />
          ) : null}

          {activeTab === "withdrawals" ? (
            <DataTable
              data={transactions.withdrawals}
              columns={withdrawalColumns}
              getRowId={(item) => item.id}
              emptyMessage="No withdrawals match the current filters."
              renderCard={(item) => (
                <article
                  key={item.id}
                  className="rounded-[1.5rem] border border-white/8 bg-[#081224]/80 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{item.user}</p>
                      <p className="mt-1 text-sm text-slate-400">{item.wallet}</p>
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
                      <p className="text-slate-500">Amount</p>
                      <p className="mt-1 text-slate-100">{formatUsd(item.amount)}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Fee</p>
                      <p className="mt-1 text-slate-100">{formatUsd(item.fee)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setSelectedTransaction({ type: "withdrawal", item })}
                      className="h-11 flex-1 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    >
                      Details
                    </Button>
                    {item.status === "PENDING" &&
                    transactionsData.capabilities.reviewPendingWithdrawal ? (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setPendingDecision({ withdrawalId: item.id, decision: "approve" })
                          }
                          className="h-11 flex-1 rounded-2xl border-emerald-300/16 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20"
                        >
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            setPendingDecision({ withdrawalId: item.id, decision: "reject" })
                          }
                          className="h-11 flex-1 rounded-2xl border-rose-300/16 bg-rose-300/10 text-rose-100 hover:bg-rose-300/20"
                        >
                          Reject
                        </Button>
                      </>
                    ) : null}
                    {item.status === "FAILED" &&
                    transactionsData.capabilities.retryFailedWithdrawal ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          void retryWithdrawal(item.id);
                        }}
                        disabled={retryWithdrawalId === item.id}
                        className="h-11 flex-1 rounded-2xl border-emerald-300/16 bg-emerald-300/10 text-emerald-100 hover:bg-emerald-300/20"
                      >
                        {retryWithdrawalId === item.id ? "Retrying..." : "Retry"}
                      </Button>
                    ) : null}
                  </div>
                </article>
              )}
            />
          ) : null}
        </div>
      </section>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-[2rem] border-t border-white/8 bg-[#050810] text-white"
        >
          <SheetHeader className="border-b border-white/8 pb-4">
            <SheetTitle>Transaction filters</SheetTitle>
            <SheetDescription>
              Adjust date, status, and amount boundaries for the active tab.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6 pt-4">
            <TransactionsFilters
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              startDate={startDate}
              onStartDateChange={setStartDate}
              endDate={endDate}
              onEndDateChange={setEndDate}
              minAmount={minAmount}
              onMinAmountChange={setMinAmount}
              maxAmount={maxAmount}
              onMaxAmountChange={setMaxAmount}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet
        open={selectedTransaction != null}
        onOpenChange={(open) => !open && setSelectedTransaction(null)}
      >
        <SheetContent
          side={detailSide}
          className="border-white/8 bg-[#050810] text-white data-[side=bottom]:max-h-[85vh] data-[side=right]:w-full data-[side=right]:max-w-xl"
        >
          {selectedTransaction ? (
            <>
              <SheetHeader className="border-b border-white/8 pb-4">
                <SheetTitle>
                  {selectedTransaction.type === "purchase"
                    ? "Purchase detail"
                    : selectedTransaction.type === "swap"
                      ? "Swap detail"
                      : "Withdrawal detail"}
                </SheetTitle>
                <SheetDescription>
                  {isMockMode
                    ? "Mock transaction detail including a generated tx hash."
                    : "Live transaction detail from the admin dashboard data source."}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 px-4 pb-6">
                <section className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">
                      {selectedTransaction.item.user}
                    </p>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                        selectedTransaction.item.status
                      )}`}
                    >
                      {selectedTransaction.item.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Date</span>
                      <span className="text-slate-100">{selectedTransaction.item.date}</span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-slate-500">Tx hash</span>
                      <span className="text-slate-100">{selectedTransactionHash}</span>
                    </div>
                    {"phaseName" in selectedTransaction.item &&
                    selectedTransaction.item.phaseName ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Phase</span>
                        <span className="text-slate-100">
                          {selectedTransaction.item.phaseName}
                        </span>
                      </div>
                    ) : null}
                    {"wallet" in selectedTransaction.item ? (
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">Wallet</span>
                        <span className="text-slate-100">{selectedTransaction.item.wallet}</span>
                      </div>
                    ) : null}
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                  <p className="text-sm font-medium text-white">Financial breakdown</p>
                  <div className="mt-4 grid gap-3 text-sm">
                    {selectedTransaction.type === "purchase" ? (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-500">Amount USDT</span>
                          <span className="text-slate-100">
                            {formatUsd(selectedTransaction.item.amountUsdt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-500">Received TTO</span>
                          <span className="text-slate-100">
                            {formatTokenAmount(selectedTransaction.item.receivedTto)}
                          </span>
                        </div>
                      </>
                    ) : null}
                    {selectedTransaction.type === "swap" ? (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-500">From TTO</span>
                          <span className="text-slate-100">
                            {formatTokenAmount(selectedTransaction.item.fromTto)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-500">To USDT</span>
                          <span className="text-slate-100">
                            {formatUsd(selectedTransaction.item.toUsdt)}
                          </span>
                        </div>
                      </>
                    ) : null}
                    {selectedTransaction.type === "withdrawal" ? (
                      <>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-500">Amount</span>
                          <span className="text-slate-100">
                            {formatUsd(selectedTransaction.item.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-slate-500">Fee</span>
                          <span className="text-slate-100">
                            {formatUsd(selectedTransaction.item.fee)}
                          </span>
                        </div>
                        {selectedTransaction.item.netAmount != null ? (
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-slate-500">Net USDT</span>
                            <span className="text-slate-100">
                              {formatUsd(selectedTransaction.item.netAmount)}
                            </span>
                          </div>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </section>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <AdminConfirmDialog
        open={decisionTarget != null}
        onOpenChange={(open) => !open && setPendingDecision(null)}
        title={
          pendingDecision?.decision === "approve"
            ? `Approve ${decisionTarget?.user} withdrawal?`
            : `Reject ${decisionTarget?.user} withdrawal?`
        }
        description={
          pendingDecision?.decision === "approve"
            ? "This local admin action will move the withdrawal from PENDING to COMPLETED."
            : "This local admin action will move the withdrawal from PENDING to FAILED."
        }
        confirmLabel={
          pendingDecision?.decision === "approve" ? "Approve withdrawal" : "Reject withdrawal"
        }
        tone={pendingDecision?.decision === "approve" ? "default" : "destructive"}
        onConfirm={() => {
          if (pendingDecision) {
            approveOrRejectWithdrawal(pendingDecision.decision);
          }
        }}
      />
    </div>
  );
}
