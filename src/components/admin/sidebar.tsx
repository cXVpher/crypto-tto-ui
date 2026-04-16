"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, SignOut } from "@phosphor-icons/react";

import { logoutAdminAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { adminNavItems } from "./admin-nav-config";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-white/8 bg-[#060a14]/90 backdrop-blur-xl",
        className
      )}
    >
      <div className="border-b border-white/8 px-5 py-5">
        <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-200">
          <ShieldCheck className="size-4" />
          TitanToon Admin
        </div>
        <div className="mt-5 space-y-2">
          <h1 className="text-xl font-semibold text-white">Operations Deck</h1>
          <p className="text-sm leading-6 text-slate-400">
            Monitor the wallet platform without the consumer mobile frame.
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1.5">
          {adminNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "group flex min-h-11 items-center gap-3 rounded-2xl border px-3 py-3 transition-all",
                  isActive
                    ? "border-cyan-300/20 bg-cyan-300/10 text-white shadow-[0_16px_40px_-28px_rgba(34,211,238,0.8)]"
                    : "border-transparent text-slate-400 hover:border-white/8 hover:bg-white/4 hover:text-slate-100"
                )}
              >
                <div
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                    isActive
                      ? "border-cyan-300/20 bg-cyan-300/12 text-cyan-100"
                      : "border-white/8 bg-white/4 text-slate-400 group-hover:text-slate-100"
                  )}
                >
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.label}</p>
                  <p className="truncate text-xs text-slate-500">{item.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="border-t border-white/8 px-3 py-4">
        <div className="rounded-3xl border border-white/8 bg-white/4 p-4">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Session
          </p>
          <p className="mt-2 text-sm text-slate-300">
            Local passphrase auth with HTTP-only signed cookies.
          </p>
        </div>
        <form action={logoutAdminAction} className="mt-4">
          <Button
            type="submit"
            variant="outline"
            className="h-11 w-full justify-start rounded-2xl border-white/10 bg-white/4 text-slate-100 hover:bg-white/8"
          >
            <SignOut className="size-4" />
            Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}
