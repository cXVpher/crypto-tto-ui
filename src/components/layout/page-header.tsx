// src/components/layout/page-header.tsx
"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function PageHeader({ title, showBack = true, rightAction }: PageHeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-navy/90 backdrop-blur-lg border-b border-white/5">
      <div className="flex items-center gap-2 min-w-[40px]">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gold" />
          </button>
        )}
      </div>
      <h1 className="text-sm font-bold tracking-widest uppercase text-foreground">
        {title}
      </h1>
      <div className="min-w-[40px] flex justify-end">{rightAction}</div>
    </header>
  );
}
