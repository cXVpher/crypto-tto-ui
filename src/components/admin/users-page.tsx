"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  Eye,
  Funnel,
  PauseCircle,
  PlayCircle,
  TreeStructure,
} from "@phosphor-icons/react";

import { AdminConfirmDialog } from "@/components/admin/admin-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { adminActiveBondings, adminPurchases, adminSwaps, adminWithdrawals } from "@/lib/admin-mock-data";
import { formatCompactNumber, formatTokenAmount, getStatusClasses } from "@/lib/admin-format";
import { downloadCsvFile } from "@/lib/csv";
import type { AdminUser, AdminUsersData } from "@/lib/admin-types";
import { truncateAddress } from "@/lib/utils";

import { DataTable, type DataTableColumn } from "./data-table";
import { useAdaptiveSheetSide } from "./use-adaptive-sheet-side";

interface UsersPageProps {
  usersData: AdminUsersData;
}

interface UserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  rankFilter: string;
  onRankFilterChange: (value: string) => void;
  ranks: string[];
}

function UserFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  rankFilter,
  onRankFilterChange,
  ranks,
}: UserFiltersProps) {
  return (
    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_180px]">
      <Input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by username or wallet address"
        className="h-11 rounded-2xl border-white/10 bg-white/5"
      />
      <select
        value={statusFilter}
        onChange={(event) => onStatusFilterChange(event.target.value)}
        className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-100 outline-none"
      >
        <option value="ALL">All statuses</option>
        <option value="ACTIVE">Active</option>
        <option value="SUSPENDED">Suspended</option>
        <option value="REVIEW">Review</option>
        <option value="RUNNING">Running bonding</option>
        <option value="IDLE">Idle bonding</option>
        <option value="ENDED">Ended bonding</option>
      </select>
      <select
        value={rankFilter}
        onChange={(event) => onRankFilterChange(event.target.value)}
        className="h-11 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-slate-100 outline-none"
      >
        <option value="ALL">All ranks</option>
        {ranks.map((rank) => (
          <option key={rank} value={rank}>
            {rank}
          </option>
        ))}
      </select>
    </div>
  );
}

function ReferralTreePreview({ user }: { user: AdminUser }) {
  const nodes = Array.from({ length: Math.min(user.referrals, 4) }, (_, index) => ({
    level: index + 1,
    wallet: `${user.walletAddress.slice(0, 6)}...${String(index + 1).padStart(2, "0")}`,
  }));

  return (
    <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
      <div className="flex items-center gap-2">
        <TreeStructure className="size-4 text-cyan-100" />
        <p className="text-sm font-medium text-white">Referral preview</p>
      </div>
      <div className="mt-4 space-y-3">
        {nodes.length > 0 ? (
          nodes.map((node) => (
            <div
              key={`${user.id}-ref-${node.level}`}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-slate-400">Level {node.level}</span>
              <span className="text-slate-100">{node.wallet}</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">No referral tree depth yet.</p>
        )}
      </div>
    </div>
  );
}

export function UsersPage({ usersData }: UsersPageProps) {
  const [users, setUsers] = useState(usersData.users);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rankFilter, setRankFilter] = useState("ALL");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [confirmUserId, setConfirmUserId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const deferredSearch = useDeferredValue(search);
  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const detailSide = useAdaptiveSheetSide();

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      normalizedSearch.length === 0 ||
      user.username.toLowerCase().includes(normalizedSearch) ||
      user.walletAddress.toLowerCase().includes(normalizedSearch);
    const matchesStatus =
      statusFilter === "ALL" ||
      user.status === statusFilter ||
      user.bondingStatus === statusFilter;
    const matchesRank = rankFilter === "ALL" || user.rank === rankFilter;

    return matchesSearch && matchesStatus && matchesRank;
  });

  const totalBonding = filteredUsers.reduce((sum, user) => sum + user.totalBonding, 0);
  const activeUsers = filteredUsers.filter((user) => user.status === "ACTIVE").length;
  const reviewUsers = filteredUsers.filter((user) => user.status === "REVIEW").length;
  const ranks = [...new Set(users.map((user) => user.rank))];
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;
  const confirmUser = users.find((user) => user.id === confirmUserId) ?? null;

  const selectedUserContext = useMemo(() => {
    if (!selectedUser) {
      return null;
    }

    return {
      bondings: adminActiveBondings.filter(
        (item) => item.userWallet === selectedUser.walletAddress
      ),
      purchases: adminPurchases.filter((item) => item.user === selectedUser.username),
      swaps: adminSwaps.filter((item) => item.user === selectedUser.username),
      withdrawals: adminWithdrawals.filter((item) => item.user === selectedUser.username),
    };
  }, [selectedUser]);

  const handleToggleUserStatus = (userId: string) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED",
            }
          : user
      )
    );

    const updatedUser = users.find((user) => user.id === userId);

    if (!updatedUser) {
      return;
    }

    setNotice(
      updatedUser.status === "SUSPENDED"
        ? `${updatedUser.username} was restored to ACTIVE locally.`
        : `${updatedUser.username} was moved to SUSPENDED locally.`
    );
  };

  const userColumns: DataTableColumn<AdminUser>[] = [
    {
      key: "wallet",
      header: "Wallet",
      cell: (user) => (
        <div>
          <p className="font-medium text-white">{truncateAddress(user.walletAddress)}</p>
          <p className="mt-1 text-xs text-slate-500">{user.lastActive}</p>
        </div>
      ),
    },
    {
      key: "identity",
      header: "Identity",
      cell: (user) => (
        <div>
          <p className="font-medium text-white">{user.username}</p>
          <p className="mt-1 text-xs text-slate-500">{user.rank}</p>
        </div>
      ),
    },
    {
      key: "registered",
      header: "Registered",
      cell: (user) => <span className="text-slate-300">{user.registeredAt}</span>,
    },
    {
      key: "bonding",
      header: "Total bonding",
      cell: (user) => (
        <div>
          <p className="font-medium text-white">{formatTokenAmount(user.totalBonding)}</p>
          <p className="mt-1 text-xs text-slate-500">{user.referrals} referrals</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      cell: (user) => (
        <div className="flex flex-wrap gap-2">
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
              user.status
            )}`}
          >
            {user.status}
          </span>
          <span
            className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
              user.bondingStatus
            )}`}
          >
            {user.bondingStatus}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "w-[220px]",
      cell: (user) => (
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setSelectedUserId(user.id)}
            className="h-10 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
          >
            <Eye className="size-4" />
            Details
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setConfirmUserId(user.id)}
            className="h-10 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
          >
            {user.status === "SUSPENDED" ? (
              <PlayCircle className="size-4" />
            ) : (
              <PauseCircle className="size-4" />
            )}
            {user.status === "SUSPENDED" ? "Unsuspend" : "Suspend"}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Visible users
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatCompactNumber(filteredUsers.length)}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Active accounts
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatCompactNumber(activeUsers)}
          </p>
        </div>
        <div className="rounded-[1.75rem] border border-white/8 bg-[#081224]/85 p-5">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
            Filtered bonding volume
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {formatTokenAmount(totalBonding)}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            {reviewUsers} accounts currently need review.
          </p>
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/8 bg-[#081224]/85 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              User management
            </p>
            <h2 className="mt-2 text-xl font-semibold text-white">
              Searchable registry with detail drawer and mobile sheets
            </h2>
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
                  "admin-users.csv",
                  filteredUsers.map((user) => ({
                    walletAddress: user.walletAddress,
                    username: user.username,
                    rank: user.rank,
                    registeredAt: user.registeredAt,
                    totalBonding: user.totalBonding,
                    status: user.status,
                    bondingStatus: user.bondingStatus,
                    referrals: user.referrals,
                    lastActive: user.lastActive,
                  }))
                )
              }
              className="h-11 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
            >
              Export CSV
            </Button>
          </div>
        </div>

        {notice ? (
          <div className="mt-5 rounded-[1.5rem] border border-cyan-300/16 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50">
            {notice}
          </div>
        ) : null}

        <div className="mt-5 hidden md:block">
          <UserFilters
            search={search}
            onSearchChange={setSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            rankFilter={rankFilter}
            onRankFilterChange={setRankFilter}
            ranks={ranks}
          />
        </div>

        <div className="mt-5">
          <DataTable
            data={filteredUsers}
            columns={userColumns}
            getRowId={(user) => user.id}
            emptyMessage="No users match the current filters."
            renderCard={(user) => (
              <article
                key={user.id}
                className="rounded-[1.5rem] border border-white/8 bg-[#081224]/80 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-white">{user.username}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {truncateAddress(user.walletAddress)}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                      user.status
                    )}`}
                  >
                    {user.status}
                  </span>
                </div>

                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-slate-500">Rank</dt>
                    <dd className="mt-1 text-slate-100">{user.rank}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Bonding</dt>
                    <dd className="mt-1 text-slate-100">
                      {formatTokenAmount(user.totalBonding)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Registered</dt>
                    <dd className="mt-1 text-slate-100">{user.registeredAt}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Last active</dt>
                    <dd className="mt-1 text-slate-100">{user.lastActive}</dd>
                  </div>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedUserId(user.id)}
                    className="h-11 flex-1 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                  >
                    <Eye className="size-4" />
                    Details
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setConfirmUserId(user.id)}
                    className="h-11 flex-1 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                  >
                    {user.status === "SUSPENDED" ? (
                      <PlayCircle className="size-4" />
                    ) : (
                      <PauseCircle className="size-4" />
                    )}
                    {user.status === "SUSPENDED" ? "Unsuspend" : "Suspend"}
                  </Button>
                </div>
              </article>
            )}
          />
        </div>
      </section>

      <Sheet open={filterSheetOpen} onOpenChange={setFilterSheetOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-[2rem] border-t border-white/8 bg-[#050810] text-white"
        >
          <SheetHeader className="border-b border-white/8 pb-4">
            <SheetTitle>User filters</SheetTitle>
            <SheetDescription>
              Adjust the mobile filter sheet, then return to the registry.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 pb-6 pt-4">
            <UserFilters
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              rankFilter={rankFilter}
              onRankFilterChange={setRankFilter}
              ranks={ranks}
            />
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={selectedUser != null} onOpenChange={(open) => !open && setSelectedUserId(null)}>
        <SheetContent
          side={detailSide}
          className="border-white/8 bg-[#050810] text-white data-[side=bottom]:max-h-[85vh] data-[side=right]:w-full data-[side=right]:max-w-2xl"
        >
          {selectedUser && selectedUserContext ? (
            <>
              <SheetHeader className="border-b border-white/8 pb-4">
                <SheetTitle>{selectedUser.username}</SheetTitle>
                <SheetDescription>
                  Wallet {selectedUser.walletAddress} • {selectedUser.rank}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-5 overflow-y-auto px-4 pb-6">
                <section className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      Account status
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          selectedUser.status
                        )}`}
                      >
                        {selectedUser.status}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                          selectedUser.bondingStatus
                        )}`}
                      >
                        {selectedUser.bondingStatus}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-slate-500">Registered</p>
                        <p className="mt-1 text-slate-100">{selectedUser.registeredAt}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Last active</p>
                        <p className="mt-1 text-slate-100">{selectedUser.lastActive}</p>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                      Value summary
                    </p>
                    <p className="mt-3 text-2xl font-semibold text-white">
                      {formatTokenAmount(selectedUser.totalBonding)}
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      {selectedUser.referrals} referrals currently tied to this
                      wallet identity.
                    </p>
                  </div>
                </section>

                <section className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-white">Bonding history</p>
                      <p className="mt-1 text-sm text-slate-400">
                        Active and recent bondings surfaced from local mock data.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setConfirmUserId(selectedUser.id)}
                      className="h-10 rounded-2xl border-white/10 bg-white/5 text-slate-100 hover:bg-white/10"
                    >
                      {selectedUser.status === "SUSPENDED" ? "Unsuspend" : "Suspend"}
                    </Button>
                  </div>
                  <div className="mt-4 space-y-3">
                    {selectedUserContext.bondings.length > 0 ? (
                      selectedUserContext.bondings.map((item) => (
                        <article
                          key={item.id}
                          className="rounded-[1.25rem] border border-white/8 bg-[#081224]/85 p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-white">{item.packageName}</p>
                            <span
                              className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                                item.status
                              )}`}
                            >
                              {item.status}
                            </span>
                          </div>
                          <div className="mt-2 grid gap-2 text-sm text-slate-300 sm:grid-cols-3">
                            <p>{formatTokenAmount(item.amount)}</p>
                            <p>{item.startDate}</p>
                            <p>{item.endDate}</p>
                          </div>
                        </article>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400">No bonding records in the mock set.</p>
                    )}
                  </div>
                </section>

                <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="rounded-[1.5rem] border border-white/8 bg-white/4 p-4">
                    <p className="text-sm font-medium text-white">Transaction history</p>
                    <div className="mt-4 space-y-3">
                      {[...selectedUserContext.purchases, ...selectedUserContext.swaps, ...selectedUserContext.withdrawals]
                        .slice(0, 5)
                        .map((item) => (
                          <article
                            key={item.id}
                            className="rounded-[1.25rem] border border-white/8 bg-[#081224]/85 p-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium text-white">{item.id}</p>
                              <span
                                className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                                  item.status
                                )}`}
                              >
                                {item.status}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-300">{item.date}</p>
                          </article>
                        ))}
                    </div>
                  </div>
                  <ReferralTreePreview user={selectedUser} />
                </section>
              </div>
            </>
          ) : null}
        </SheetContent>
      </Sheet>

      <AdminConfirmDialog
        open={confirmUser != null}
        onOpenChange={(open) => !open && setConfirmUserId(null)}
        title={
          confirmUser?.status === "SUSPENDED"
            ? `Restore ${confirmUser.username}?`
            : `Suspend ${confirmUser?.username}?`
        }
        description={
          confirmUser?.status === "SUSPENDED"
            ? "This local admin action will mark the user as ACTIVE again in mock mode."
            : "This local admin action will mark the user as SUSPENDED in mock mode."
        }
        confirmLabel={confirmUser?.status === "SUSPENDED" ? "Unsuspend user" : "Suspend user"}
        tone={confirmUser?.status === "SUSPENDED" ? "default" : "destructive"}
        onConfirm={() => {
          if (confirmUserId) {
            handleToggleUserStatus(confirmUserId);
          }
        }}
      />
    </div>
  );
}
