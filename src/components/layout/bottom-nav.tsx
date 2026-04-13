// src/components/layout/bottom-nav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWalletStore } from "@/store/use-wallet-store";
import { bottomNavItems } from "./bottom-nav-config";
import { useNavigationTransition } from "./navigation-transition-context";

export function BottomNav() {
  const pathname = usePathname();
  const shouldShowNav = useWalletStore(
    (state) => state.hasHydrated && state.isConnected
  );
  const { setRouteTransition } = useNavigationTransition();

  if (!shouldShowNav) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50">
      <div className="mx-auto w-full max-w-[430px] bg-navy-light/95 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center gap-2 px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setRouteTransition(pathname, item.href)}
                className={cn(
                  "flex flex-1 min-w-0 h-[50px] flex-col items-center justify-center gap-1 rounded-full border transition-all duration-200",
                  isActive
                    ? "text-gold bg-white/5 border-white/10"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[10px] font-medium leading-none whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
