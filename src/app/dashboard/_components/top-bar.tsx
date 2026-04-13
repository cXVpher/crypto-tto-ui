"use client";

import { createPortal } from "react-dom";
import { Bell, Check, Copy } from "@phosphor-icons/react";
import { useCopyFeedback } from "@/lib/use-copy-feedback";
import { useWalletStore } from "@/store/use-wallet-store";

export function TopBar() {
  const username = useWalletStore((state) => state.username);
  const walletAddress = useWalletStore((state) => state.walletAddress);
  const { copiedKey, copyToClipboard } = useCopyFeedback();
  const copyAddress = () => copyToClipboard("wallet-address", walletAddress);
  const headerHost =
    typeof document === "undefined"
      ? null
      : document.getElementById("page-header-root");

  const header = (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex min-h-[76px] w-full max-w-[430px] items-center justify-between border-b border-white/8 bg-[#031123]/35 px-4 py-4 backdrop-blur-xl">
        {/* Left: avatar + name */}
        <button onClick={copyAddress} className="flex items-center gap-3">
          <div
            className="w-10 h-10 shrink-0 rounded-full border-2 flex items-center justify-center text-xs font-bold"
            style={{ borderColor: "#6ab2ff", background: "#00193b", color: "#6ab2ff" }}
          >
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col items-start">
            <p className="text-xs font-medium" style={{ color: "#98abd4" }}>Main Wallet</p>
            <div className="flex items-center gap-1.5">
              <h2 className="text-lg font-bold leading-tight" style={{ color: "#dbe5ff" }}>
                {username}
              </h2>
              {copiedKey === "wallet-address"
                ? <Check className="w-3.5 h-3.5" style={{ color: "#6ab2ff" }} />
                : <Copy className="w-3 h-3" style={{ color: "#62769c" }} />
              }
            </div>
          </div>
        </button>

        {/* Right: icon buttons */}
        <div className="flex items-center gap-2">
          <button
            className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
            style={{ background: "rgba(0,31,70,0.6)", color: "#dbe5ff" }}
          >
            <Bell className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );

  return (
    <>
      {headerHost ? createPortal(header, headerHost) : null}
      <div className="h-[76px]" aria-hidden="true" />
    </>
  );
}
