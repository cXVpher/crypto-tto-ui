"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { List } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

import {
  adminBottomNavItems,
  adminNavItems,
  isAdminNavItemActive,
} from "@/app/admin/_services/admin-nav-config";

interface AdminBottomNavProps {
  onOpenOverflow: () => void;
  compactFrame?: boolean;
}

export function AdminBottomNav({
  onOpenOverflow,
  compactFrame = false,
}: AdminBottomNavProps) {
  const pathname = usePathname();
  const isOverflowActive = adminNavItems
    .slice(adminBottomNavItems.length)
    .some((item) => isAdminNavItemActive(pathname, item.href));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/8 bg-[#07101d]/95 px-3 py-2 backdrop-blur-xl md:hidden">
      <div
        className={cn(
          "mx-auto flex items-center gap-2",
          compactFrame ? "max-w-[430px]" : "max-w-2xl"
        )}
      >
        {adminBottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isAdminNavItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border text-[11px] font-medium transition-all",
                isActive
                  ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                  : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100"
              )}
            >
              <Icon className="size-5" />
              <span>{item.shortLabel}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={onOpenOverflow}
          className={cn(
            "flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-2xl border text-[11px] font-medium transition-all",
            isOverflowActive
              ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
              : "border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-100"
          )}
        >
          <List className="size-5" />
          <span>More</span>
        </button>
      </div>
    </nav>
  );
}
