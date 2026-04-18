"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";

import { logoutAdminAction } from "@/app/admin/login/_services/actions";
import { adminNavItems } from "@/app/admin/_services/admin-nav-config";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { AdminBottomNav } from "./admin-bottom-nav";
import { AdminTopBar } from "./admin-top-bar";
import { Sidebar } from "./sidebar";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [isOverflowOpen, setIsOverflowOpen] = useState(false);
  const isLoginRoute = pathname === "/admin/login";
  const isOverviewRoute = pathname === "/admin";

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050810] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(56,189,248,0.12),_transparent_24%),linear-gradient(180deg,_rgba(4,12,24,0.2)_0%,_rgba(4,12,24,0.86)_36%,_rgba(4,12,24,1)_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />

      <div
        className={cn(
          "relative flex min-h-screen",
          isOverviewRoute && "justify-center lg:justify-start"
        )}
      >
        <div className="hidden w-[280px] shrink-0 lg:block">
          <Sidebar className="fixed inset-y-0 left-0 w-[280px] overflow-y-auto" />
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            isOverviewRoute &&
              "w-full max-w-[430px] overflow-x-hidden border-x border-white/8 bg-[#07101d]/70 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] lg:max-w-none lg:border-x-0 lg:bg-transparent lg:shadow-none"
          )}
        >
          <AdminTopBar compactFrame={isOverviewRoute} />
          <main
            className={cn(
              "min-w-0 flex-1",
              isOverviewRoute
                ? "px-4 py-4 pb-24 lg:px-8 lg:py-8 lg:pb-8"
                : "px-4 py-4 pb-24 md:px-6 md:py-6 lg:px-8 lg:py-8 lg:pb-8"
            )}
          >
            {children}
          </main>
        </div>
      </div>

      <AdminBottomNav
        onOpenOverflow={() => setIsOverflowOpen(true)}
        compactFrame={isOverviewRoute}
      />

      <Sheet open={isOverflowOpen} onOpenChange={setIsOverflowOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-[2rem] border-t border-white/8 bg-[#050810] px-0 pb-6 text-white"
        >
          <SheetHeader className="border-b border-white/8 px-4 pb-4">
            <SheetTitle>More admin actions</SheetTitle>
            <SheetDescription>
              Access token controls, settings, and session actions.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-2 px-4 pt-4">
            {adminNavItems.slice(4).map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOverflowOpen(false)}
                  className="flex min-h-12 items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-slate-100"
                >
                  <Icon className="size-5 text-cyan-100" />
                  <div>
                    <p className="font-medium">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </Link>
              );
            })}

            <form
              action={logoutAdminAction}
              onSubmit={() => setIsOverflowOpen(false)}
              className="pt-2"
            >
              <Button
                type="submit"
                variant="outline"
                className="h-12 w-full rounded-2xl border-white/10 bg-white/5 justify-start text-slate-100 hover:bg-white/10"
              >
                <SignOut className="size-4" />
                Logout
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
