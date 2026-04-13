// src/components/layout/page-header.tsx
"use client";

import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";
import { useWalletStore } from "@/store/use-wallet-store";
import { useNavigationTransition } from "./navigation-transition-context";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, showBack = true, rightAction }: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const canReturnToDashboard = useWalletStore(
    (state) => state.hasHydrated && state.isConnected
  );
  const { setRouteTransition } = useNavigationTransition();
  const headerHost =
    typeof document === "undefined"
      ? null
      : document.getElementById("page-header-root");

  function getBackTarget() {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length <= 1) {
      return canReturnToDashboard ? "/dashboard" : "/";
    }

    return `/${segments.slice(0, -1).join("/")}`;
  }

  function handleBack() {
    const target = getBackTarget();
    setRouteTransition(pathname, target);
    router.push(target);
  }

  const header = (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex w-full max-w-[430px] items-center justify-between border-b border-white/8 bg-[#031123]/35 px-4 py-3 backdrop-blur-xl">
        <div className="flex min-w-[40px] items-center gap-2">
          {showBack && (
            <button
              onClick={handleBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-white/5"
            >
              <CaretLeft className="h-5 w-5 text-gold" />
            </button>
          )}
        </div>
        <h1 className="text-sm font-bold tracking-widest uppercase text-foreground">
          {title}
        </h1>
        <div className="flex min-w-[40px] justify-end">{rightAction}</div>
      </div>
    </header>
  );

  return (
    <>
      {headerHost ? createPortal(header, headerHost) : null}
      <div className="h-[57px]" aria-hidden="true" />
    </>
  );
}
