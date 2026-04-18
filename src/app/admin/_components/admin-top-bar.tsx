"use client";

import { usePathname } from "next/navigation";
import { CalendarBlank, SignOut } from "@phosphor-icons/react";

import { logoutAdminAction } from "@/app/admin/login/_services/actions";
import { adminNavItems } from "@/app/admin/_services/admin-nav-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminTopBarProps {
  compactFrame?: boolean;
}

function getTitleFromPathname(pathname: string) {
  const exactMatch = adminNavItems.find((item) => item.href === pathname);

  if (exactMatch) {
    return exactMatch;
  }

  return adminNavItems.find(
    (item) => item.href !== "/admin" && pathname.startsWith(`${item.href}/`)
  );
}

export function AdminTopBar({ compactFrame = false }: AdminTopBarProps) {
  const pathname = usePathname();
  const currentItem = getTitleFromPathname(pathname) ?? adminNavItems[0];

  return (
    <header className="sticky top-0 z-30 border-b border-white/8 bg-[#050810]/80 backdrop-blur-xl">
      <div
        className={cn(
          "flex min-h-18 items-center gap-3 py-3",
          compactFrame
            ? "mx-auto w-full max-w-[430px] px-4 lg:max-w-none lg:px-8"
            : "px-4 md:px-6 lg:px-8"
        )}
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-white md:text-xl">
              {currentItem.label}
            </h1>
            <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
              Secure admin
            </div>
          </div>
          <p className="mt-1 truncate text-sm text-slate-400">
            {currentItem.description}
          </p>
        </div>

        <div
          className={cn(
            "hidden items-center gap-2",
            compactFrame ? "lg:flex" : "md:flex"
          )}
        >
          <div className="rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-right">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
              Session mode
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm text-slate-200">
              <CalendarBlank className="size-4 text-cyan-200" />
              Local passphrase
            </div>
          </div>

          <form action={logoutAdminAction}>
            <Button
              type="submit"
              variant="outline"
              className={cn(
                "h-11 rounded-2xl border-white/10 bg-white/5 px-4 text-slate-100 hover:bg-white/10"
              )}
            >
              <SignOut className="size-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
