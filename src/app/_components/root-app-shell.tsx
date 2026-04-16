"use client";

import { usePathname } from "next/navigation";

import { BottomNav } from "@/components/layout/bottom-nav";
import { MobileFrame } from "@/components/layout/mobile-frame";
import { NavigationTransitionProvider } from "@/components/layout/navigation-transition-context";
import { PageTransition } from "@/components/layout/page-transition";
import { QueryProvider } from "@/components/providers/query-provider";

interface RootAppShellProps {
  children: React.ReactNode;
}

export function RootAppShell({ children }: RootAppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <QueryProvider>{children}</QueryProvider>;
  }

  return (
    <NavigationTransitionProvider>
      <MobileFrame>
        <div id="page-header-root" />
        <QueryProvider>
          <PageTransition>{children}</PageTransition>
        </QueryProvider>
        <BottomNav />
      </MobileFrame>
    </NavigationTransitionProvider>
  );
}
