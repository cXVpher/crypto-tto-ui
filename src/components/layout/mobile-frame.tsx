// src/components/layout/mobile-frame.tsx
"use client";

export function MobileFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-center min-h-screen bg-[#050810]">
      <div className="w-full max-w-[430px] min-h-screen bg-navy relative overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
