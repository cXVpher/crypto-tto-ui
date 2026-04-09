// src/components/layout/page-header.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { CaretLeft } from "@phosphor-icons/react";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, showBack = true, rightAction }: PageHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  function getBackTarget() {
    const segments = pathname.split("/").filter(Boolean);

    if (segments.length <= 1) {
      return "/dashboard";
    }

    return `/${segments.slice(0, -1).join("/")}`;
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto flex w-full max-w-[430px] items-center justify-between border-b border-white/8 bg-[#031123]/35 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-2 min-w-[40px]">
            {showBack && (
              <button
                onClick={() => router.push(getBackTarget())}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
              >
                <CaretLeft className="w-5 h-5 text-gold" />
              </button>
            )}
          </div>
          <h1 className="text-sm font-bold tracking-widest uppercase text-foreground">
            {title}
          </h1>
          <div className="min-w-[40px] flex justify-end">{rightAction}</div>
        </div>
      </header>
      <div className="h-[57px]" aria-hidden="true" />
    </>
  );
}
